import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadOpenCV } from '../utils/opencv-loader.js';
import { detectMarkers, type DetectedMarker } from '../pipeline/aruco-detector.js';
import { correctPerspective, matToBlob } from '../pipeline/perspective.js';
import { columnExtract, type PipelineDebug } from '../pipeline/column-extractor.js';
import { classifyDigitWithCV, initClassifier } from '../pipeline/digit-classifier.js';
import { assembleFieldValues } from '../models/form-schema.js';
import { getCapture, saveCapture, updateCaptureStatus } from '../utils/db.js';

interface DigitResult {
  cellId: string;
  row: string;
  col: string;
  digit: number;
  confidence: number;
}

type ProcessState =
  | 'loading-cv'
  | 'detecting'
  | 'correcting'
  | 'extracting'
  | 'classifying'
  | 'done'
  | 'error';

type DebugStage = 'columns' | 'boxes' | 'digits' | '';

@customElement('image-processor')
export class ImageProcessor extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      flex: 1;
      padding: 16px;
      gap: 16px;
      overflow-y: auto;
    }

    .status { text-align: center; color: #666; }
    .status.error { color: #d93025; }

    .spinner {
      width: 40px; height: 40px;
      border: 4px solid #e0e0e0; border-top-color: #1a73e8;
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .results {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; width: 100%; max-width: 600px;
    }

    .result-img {
      width: 100%; max-height: 40vh; object-fit: contain;
      border: 1px solid #ddd; border-radius: 4px;
    }

    .info-bar {
      font-size: 0.85rem; color: #333; background: #f0f0f0;
      padding: 8px 16px; border-radius: 4px; width: 100%;
    }

    .ocr-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    .ocr-table th, .ocr-table td { border: 1px solid #ddd; padding: 4px 6px; text-align: center; }
    .ocr-table th { background: #e8e8e8; font-size: 0.7rem; position: sticky; top: 0; }
    .ocr-table .row-header { text-align: left; font-weight: bold; background: #f4f4f4; }
    .ocr-table td.clickable { cursor: pointer; }
    .ocr-table td.has-value { background: #e8f5e9; font-weight: bold; }
    .ocr-table td.low-conf { background: #fff3e0; }
    .ocr-table td.selected { outline: 2px solid #1a73e8; outline-offset: -2px; }

    .table-wrapper { width: 100%; overflow-x: auto; }

    .cell-preview {
      width: 100%; background: #fafafa; border: 1px solid #ddd;
      border-radius: 4px; padding: 12px;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .cell-preview-header { font-size: 0.85rem; font-weight: 500; color: #333; }
    .cell-preview-img { image-rendering: pixelated; border: 1px solid #ccc; background: white; }
    .cell-preview-details { font-size: 0.8rem; color: #666; }

    .controls { display: flex; gap: 12px; padding: 8px 0; }
    button { padding: 10px 20px; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; }
    .done-btn { background: #1a73e8; color: white; }

    /* Debug stages */
    .debug-section {
      width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;
    }
    .debug-header {
      background: #f5f5f5; padding: 8px 12px; cursor: pointer;
      font-size: 0.85rem; font-weight: 500; display: flex;
      justify-content: space-between; align-items: center;
      user-select: none;
    }
    .debug-header:hover { background: #eee; }
    .debug-body { padding: 8px 12px; }
    .debug-img {
      width: 100%; height: auto; image-rendering: pixelated;
      border: 1px solid #ccc; border-radius: 2px;
    }
    .debug-meta { font-size: 0.75rem; color: #666; margin: 4px 0; }
    .col-thumbs {
      display: flex; gap: 4px; overflow-x: auto; padding: 4px 0;
    }
    .col-thumb {
      cursor: pointer; border: 2px solid transparent; border-radius: 2px;
      flex-shrink: 0;
    }
    .col-thumb.active { border-color: #1a73e8; }
    .col-thumb img { height: 80px; width: auto; image-rendering: pixelated; }
  `;

  @property({ type: Number }) captureId = 0;

  @state() private _processState: ProcessState = 'loading-cv';
  @state() private _error = '';
  @state() private _markers: DetectedMarker[] = [];
  @state() private _resultUrl = '';
  @state() private _classifyProgress = '';
  @state() private _selectedCellId = '';

  // New pipeline state
  @state() private _pipelineDebug: PipelineDebug | null = null;
  @state() private _digitResults: DigitResult[] = [];
  @state() private _openDebugStage: DebugStage = '';
  @state() private _debugSelectedCol = 0;

  /** MNIST 28×28 patches keyed by cellId */
  private _mnistPatches = new Map<string, ImageData>();

  /** Cached data URLs for debug images */
  private _debugUrls = new Map<string, string>();

  connectedCallback(): void {
    super.connectedCallback();
    this._process();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._resultUrl) URL.revokeObjectURL(this._resultUrl);
  }

  private _getDebugUrl(key: string, imageData: ImageData): string {
    let url = this._debugUrls.get(key);
    if (!url) {
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      canvas.getContext('2d')!.putImageData(imageData, 0, 0);
      url = canvas.toDataURL('image/png');
      this._debugUrls.set(key, url);
    }
    return url;
  }

  private async _process(): Promise<void> {
    try {
      this._processState = 'loading-cv';
      const cv = await loadOpenCV();

      const capture = await getCapture(this.captureId);
      if (!capture) {
        this._error = 'Capture not found in database.';
        this._processState = 'error';
        return;
      }

      const imageBitmap = await createImageBitmap(capture.blob);
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imageBitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const src = cv.matFromImageData(imageData);

      try {
        // Detect ArUco markers
        this._processState = 'detecting';
        this._markers = detectMarkers(cv, src);

        if (this._markers.length < 4) {
          const found = this._markers.map((m) => m.id).join(', ');
          this._error = `Found ${this._markers.length}/4 markers${found ? ` (IDs: ${found})` : ''}. Need all 4 corner markers.`;
          this._processState = 'error';
          return;
        }

        // Perspective correction
        this._processState = 'correcting';
        const result = correctPerspective(cv, src, this._markers);
        if (!result) {
          this._error = 'Perspective correction failed.';
          this._processState = 'error';
          return;
        }

        try {
          // Save corrected image
          const correctedBlob = await matToBlob(cv, result.corrected);
          await saveCapture(correctedBlob);
          await updateCaptureStatus(this.captureId, 'processed');
          this._resultUrl = URL.createObjectURL(correctedBlob);

          // Column-based extraction
          this._processState = 'extracting';
          const extraction = columnExtract(cv, result.corrected);
          this._pipelineDebug = extraction.debug;

          // Classify digits
          this._processState = 'classifying';
          await initClassifier();
          const digitResults: DigitResult[] = [];
          const total = extraction.digits.length;

          for (let i = 0; i < extraction.digits.length; i++) {
            const d = extraction.digits[i];
            const mat = cv.matFromImageData(d.imageData);
            const result = await classifyDigitWithCV(cv, mat);
            mat.delete();

            if (result.mnistPatch) {
              this._mnistPatches.set(d.cellId, result.mnistPatch);
            }

            digitResults.push({
              cellId: d.cellId,
              row: d.row,
              col: d.col,
              digit: result.digit,
              confidence: result.confidence,
            });

            if ((i + 1) % 20 === 0 || i === total - 1) {
              this._classifyProgress = `${i + 1}/${total}`;
            }
          }

          this._digitResults = digitResults;
          this._processState = 'done';
        } finally {
          result.corrected.delete();
        }
      } finally {
        src.delete();
      }
    } catch (err) {
      this._error = err instanceof Error ? err.message : 'Processing failed.';
      this._processState = 'error';
    }
  }

  private _done(): void {
    this.dispatchEvent(
      new CustomEvent('processing-complete', {
        detail: { results: this._digitResults },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _selectCell(cellId: string): void {
    this._selectedCellId = this._selectedCellId === cellId ? '' : cellId;
  }

  private _toggleDebugStage(stage: DebugStage): void {
    this._openDebugStage = this._openDebugStage === stage ? '' : stage;
  }

  private _getFieldDigitIds(cellId: string): string[] {
    const fieldId = cellId.replace(/_d\d+$/, '');
    return this._digitResults
      .filter((r) => r.cellId.startsWith(fieldId + '_d'))
      .map((r) => r.cellId);
  }

  private _navigateDigit(delta: number): void {
    const digitIds = this._getFieldDigitIds(this._selectedCellId);
    const idx = digitIds.indexOf(this._selectedCellId);
    const newIdx = Math.max(0, Math.min(digitIds.length - 1, idx + delta));
    this._selectedCellId = digitIds[newIdx];
  }

  render() {
    switch (this._processState) {
      case 'loading-cv':
        return this._renderSpinner('Loading OpenCV...');
      case 'detecting':
        return this._renderSpinner('Detecting ArUco markers...');
      case 'correcting':
        return this._renderSpinner('Correcting perspective...');
      case 'extracting':
        return this._renderSpinner('Extracting columns and digits...');
      case 'classifying':
        return this._renderSpinner(`Classifying digits... ${this._classifyProgress}`);
      case 'error':
        return html`
          <p class="status error">${this._error}</p>
          <div class="controls">
            <button class="done-btn" @click=${this._done}>Back</button>
          </div>
        `;
      case 'done':
        return this._renderResults();
    }
  }

  private _renderSpinner(msg: string) {
    return html`<div class="spinner"></div><p class="status">${msg}</p>`;
  }

  // --- Debug stage rendering ---

  private _renderDebugStages() {
    const debug = this._pipelineDebug;
    if (!debug) return nothing;

    return html`
      ${this._renderColumnsStage(debug)}
      ${this._renderBoxesStage(debug)}
      ${this._renderDigitsStage(debug)}
    `;
  }

  private _renderColumnsStage(debug: PipelineDebug) {
    const open = this._openDebugStage === 'columns';
    const heights = [
      debug.rowBounds[1] - debug.rowBounds[0],
      debug.rowBounds[2] - debug.rowBounds[1],
      debug.rowBounds[3] - debug.rowBounds[2],
    ];
    return html`
      <div class="debug-section">
        <div class="debug-header" @click=${() => this._toggleDebugStage('columns')}>
          <span>Stage 1: Column Detection</span>
          <span>${open ? '\u25B2' : '\u25BC'}</span>
        </div>
        ${open ? html`
          <div class="debug-body">
            <div class="debug-meta">
              Rows: ${debug.rowBounds.join(', ')} (heights: ${heights.join(', ')}px)
              | Header top: ${debug.headerTop}
              | ${debug.columnDividers.length} columns, avg width: ${debug.avgColumnWidth}px
            </div>
            <img class="debug-img" src=${this._getDebugUrl('tableStrip', debug.tableStripImage)}
              alt="Table strip with column dividers" />
            <div class="debug-meta">
              Dividers: ${debug.columnDividers.join(', ')}
            </div>
          </div>
        ` : nothing}
      </div>
    `;
  }

  private _renderBoxesStage(debug: PipelineDebug) {
    const open = this._openDebugStage === 'boxes';
    const columns = [
      '90L RUC', '7.6L Sharps', '20L Sharps', '25L Sharps',
      '2.5L Specibin', '5L Specibin', '10L Specibin', '20L Specibin',
      '25L Specibin', 'Pharma 5L', 'Pharma 20L', '50L Box', '142L Box', 'Other',
    ];
    const selectedCrop = debug.columnCrops.get(this._debugSelectedCol);

    return html`
      <div class="debug-section">
        <div class="debug-header" @click=${() => this._toggleDebugStage('boxes')}>
          <span>Stage 2: Digit Box Extraction</span>
          <span>${open ? '\u25B2' : '\u25BC'}</span>
        </div>
        ${open ? html`
          <div class="debug-body">
            <div class="col-thumbs">
              ${Array.from({ length: 14 }, (_, i) => {
                const crop = debug.columnCrops.get(i);
                if (!crop) return nothing;
                return html`
                  <div class="col-thumb ${i === this._debugSelectedCol ? 'active' : ''}"
                    @click=${() => { this._debugSelectedCol = i; }}>
                    <img src=${this._getDebugUrl(`col_${i}`, crop)}
                      alt="${columns[i]}" title="${columns[i]}" />
                  </div>
                `;
              })}
            </div>
            <div class="debug-meta">${columns[this._debugSelectedCol]}</div>
            ${selectedCrop ? html`
              <img class="debug-img" src=${this._getDebugUrl(`col_${this._debugSelectedCol}`, selectedCrop)}
                alt="Column ${this._debugSelectedCol} with digit boxes" />
            ` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
  }

  private _renderDigitsStage(debug: PipelineDebug) {
    const open = this._openDebugStage === 'digits';
    const columns = [
      '90L RUC', '7.6L Sharps', '20L Sharps', '25L Sharps',
      '2.5L Specibin', '5L Specibin', '10L Specibin', '20L Specibin',
      '25L Specibin', 'Pharma 5L', 'Pharma 20L', '50L Box', '142L Box', 'Other',
    ];
    const rows = ['received', 'gross_kg', 'nett_kg'];
    const col = columns[this._debugSelectedCol];
    const fieldPrefix = col.replace(/[\s.]/g, '_');

    return html`
      <div class="debug-section">
        <div class="debug-header" @click=${() => this._toggleDebugStage('digits')}>
          <span>Stage 3: Classification Results</span>
          <span>${open ? '\u25B2' : '\u25BC'}</span>
        </div>
        ${open ? html`
          <div class="debug-body">
            <div class="debug-meta">Column: ${col} (use thumbnails above to change)</div>
            ${rows.map((row) => {
              const rowLabel = row === 'received' ? 'Received' : row === 'gross_kg' ? 'Gross KG' : 'Nett KG';
              const isKG = row !== 'received';
              const nDigits = isKG ? 4 : 3;
              const fieldId = `${row}_${fieldPrefix}`;

              return html`
                <div class="debug-meta" style="margin-top:8px; font-weight:500;">${rowLabel}</div>
                <div style="display:flex; gap:4px; flex-wrap:wrap;">
                  ${Array.from({ length: nDigits }, (_, di) => {
                    const cellId = `${fieldId}_d${di}`;
                    const rawImg = debug.digitCrops.get(cellId);
                    const ppImg = debug.digitPreprocessed.get(cellId);
                    const mnistImg = this._mnistPatches.get(cellId);
                    const result = this._digitResults.find(r => r.cellId === cellId);
                    if (!rawImg) return nothing;

                    const confColor = (result?.confidence ?? 0) >= 50 ? '#4caf50' : '#d93025';

                    return html`
                      <div style="text-align:center; border:1px solid #ddd; border-radius:4px; padding:4px; min-width:60px;">
                        <img src=${this._getDebugUrl(`raw_${cellId}`, rawImg)}
                          style="width:34px; height:51px; image-rendering:pixelated; display:block; margin:0 auto;" />
                        ${ppImg ? html`
                          <img src=${this._getDebugUrl(`pp_${cellId}`, ppImg)}
                            style="width:34px; height:51px; image-rendering:pixelated; display:block; margin:2px auto 0;" />
                        ` : nothing}
                        ${mnistImg ? html`
                          <img src=${this._getDebugUrl(`mnist_${cellId}`, mnistImg)}
                            style="width:28px; height:28px; image-rendering:pixelated; display:block; margin:2px auto 0; border:1px solid #aaa;" />
                        ` : nothing}
                        <div style="font-size:0.75rem; font-weight:bold; margin-top:2px;">
                          ${result ? result.digit : '?'}
                        </div>
                        <div style="font-size:0.65rem; color:${confColor};">
                          ${result ? `${result.confidence.toFixed(0)}%` : ''}
                        </div>
                      </div>
                    `;
                  })}
                </div>
              `;
            })}
          </div>
        ` : nothing}
      </div>
    `;
  }

  // --- Cell preview ---

  private _renderCellPreview() {
    if (!this._selectedCellId) return nothing;

    const debug = this._pipelineDebug;
    if (!debug) return nothing;

    const rawImg = debug.digitCrops.get(this._selectedCellId);
    if (!rawImg) return nothing;

    const ppImg = debug.digitPreprocessed.get(this._selectedCellId);
    const result = this._digitResults.find((r) => r.cellId === this._selectedCellId);

    const isDigitBox = this._selectedCellId.includes('_d');
    const digitIds = isDigitBox ? this._getFieldDigitIds(this._selectedCellId) : [];
    const digitIdx = digitIds.indexOf(this._selectedCellId);

    // Find which column this cell belongs to
    const colName = result?.col || '';
    const rowName = result?.row || '';

    return html`
      <div class="cell-preview">
        <div class="cell-preview-header">
          ${colName} ${rowName ? ` (${rowName})` : ''}
          ${isDigitBox ? html` — digit ${digitIdx + 1}/${digitIds.length}` : ''}
        </div>

        ${isDigitBox && digitIds.length > 1 ? html`
          <div style="display:flex; gap:8px; justify-content:center; margin:4px 0;">
            <button style="padding:4px 12px; font-size:0.85rem;" ?disabled=${digitIdx === 0}
              @click=${() => this._navigateDigit(-1)}>&larr; Prev</button>
            <button style="padding:4px 12px; font-size:0.85rem;" ?disabled=${digitIdx === digitIds.length - 1}
              @click=${() => this._navigateDigit(1)}>Next &rarr;</button>
          </div>
        ` : nothing}

        <div class="cell-preview-details">
          Result: <strong>"${result ? String(result.digit) : ''}"</strong> |
          Confidence: <strong>${result?.confidence?.toFixed(0) ?? '?'}%</strong>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; width:100%;">
          <div style="text-align:center">
            <div style="font-size:0.65rem; color:#999;">Raw crop</div>
            <img class="cell-preview-img" src=${this._getDebugUrl(`raw_${this._selectedCellId}`, rawImg)}
              alt="Raw crop" style="width:100%; height:auto; image-rendering:pixelated;" />
          </div>
          ${ppImg ? html`
            <div style="text-align:center">
              <div style="font-size:0.65rem; color:#999;">Preprocessed</div>
              <img class="cell-preview-img" src=${this._getDebugUrl(`pp_${this._selectedCellId}`, ppImg)}
                alt="Preprocessed" style="width:100%; height:auto; image-rendering:pixelated;" />
            </div>
          ` : nothing}
          ${(() => {
            const mnistImg = this._mnistPatches.get(this._selectedCellId);
            return mnistImg ? html`
              <div style="text-align:center">
                <div style="font-size:0.65rem; color:#999;">MNIST input (28x28)</div>
                <img class="cell-preview-img" src=${this._getDebugUrl(`mnist_${this._selectedCellId}`, mnistImg)}
                  alt="MNIST patch" style="width:100%; height:auto; image-rendering:pixelated;" />
              </div>
            ` : nothing;
          })()}
        </div>
      </div>
    `;
  }

  // --- Results table ---

  private _renderResults() {
    const digitMap = new Map<string, string>();
    for (const r of this._digitResults) {
      digitMap.set(r.cellId, String(r.digit));
    }
    const fieldValues = assembleFieldValues(digitMap);

    const fieldConfidence = new Map<string, number>();
    const fieldDigits = new Map<string, number[]>();
    for (const r of this._digitResults) {
      const fieldId = r.cellId.replace(/_d\d+$/, '');
      if (!fieldDigits.has(fieldId)) fieldDigits.set(fieldId, []);
      fieldDigits.get(fieldId)!.push(r.confidence);
    }
    for (const [fieldId, confs] of fieldDigits) {
      fieldConfidence.set(fieldId, confs.reduce((a, b) => a + b, 0) / confs.length);
    }

    const rows = ['received', 'gross_kg', 'nett_kg'];
    const columns = [
      '90L RUC', '7.6L Sharps', '20L Sharps', '25L Sharps',
      '2.5L Specibin', '5L Specibin', '10L Specibin', '20L Specibin',
      '25L Specibin', 'Pharma 5L', 'Pharma 20L', '50L Box', '142L Box', 'Other',
    ];

    return html`
      <div class="results">
        <img class="result-img" src=${this._resultUrl} alt="Corrected form" />

        <div class="info-bar">
          Markers: ${this._markers.length}/4 |
          ${this._digitResults.length} digits classified
        </div>

        ${this._renderDebugStages()}

        ${this._renderCellPreview()}

        <div class="table-wrapper">
          <table class="ocr-table">
            <thead>
              <tr>
                <th></th>
                ${columns.map((col) => html`<th>${col}</th>`)}
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => {
                const label = row === 'received' ? 'Received'
                  : row === 'gross_kg' ? 'Gross KG' : 'Nett KG';
                return html`
                  <tr>
                    <td class="row-header">${label}</td>
                    ${columns.map((col) => {
                      const fieldId = `${row}_${col.replace(/[\s.]/g, '_')}`;
                      const val = fieldValues.get(fieldId) || '';
                      const conf = fieldConfidence.get(fieldId) ?? 0;
                      const isSelected = this._selectedCellId.startsWith(fieldId);
                      const firstBoxId = `${fieldId}_d0`;
                      let cls = 'clickable';
                      if (val && val !== '000' && val !== '000,0')
                        cls += conf < 50 ? ' has-value low-conf' : ' has-value';
                      if (isSelected) cls += ' selected';
                      return html`<td
                        class=${cls}
                        @click=${() => this._selectCell(firstBoxId)}
                      >${val || '\u2014'}</td>`;
                    })}
                  </tr>
                `;
              })}
            </tbody>
          </table>
        </div>

        <div class="controls">
          <button class="done-btn" @click=${this._done}>Done</button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'image-processor': ImageProcessor;
  }
}
