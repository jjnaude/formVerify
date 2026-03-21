import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadOpenCV } from '../utils/opencv-loader.js';
import { detectMarkers, type DetectedMarker } from '../pipeline/aruco-detector.js';
import { correctPerspective, matToBlob } from '../pipeline/perspective.js';
import { extractROIs } from '../pipeline/roi-extractor.js';
import { recognizeCells, type OCRResult } from '../pipeline/ocr.js';
import { MANIFEST_SCHEMA, assembleFieldValues } from '../models/form-schema.js';
import { getCapture, saveCapture, updateCaptureStatus } from '../utils/db.js';

type ProcessState =
  | 'loading-cv'
  | 'detecting'
  | 'correcting'
  | 'extracting'
  | 'ocr'
  | 'done'
  | 'error';

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

    .status {
      text-align: center;
      color: #666;
    }

    .status.error {
      color: #d93025;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e0e0e0;
      border-top-color: #1a73e8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .results {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
      max-width: 600px;
    }

    .result-img {
      width: 100%;
      max-height: 40vh;
      object-fit: contain;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .info-bar {
      font-size: 0.85rem;
      color: #333;
      background: #f0f0f0;
      padding: 8px 16px;
      border-radius: 4px;
      width: 100%;
    }

    .ocr-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
    }

    .ocr-table th,
    .ocr-table td {
      border: 1px solid #ddd;
      padding: 4px 6px;
      text-align: center;
    }

    .ocr-table th {
      background: #e8e8e8;
      font-size: 0.7rem;
      position: sticky;
      top: 0;
    }

    .ocr-table .row-header {
      text-align: left;
      font-weight: bold;
      background: #f4f4f4;
    }

    .ocr-table td.clickable {
      cursor: pointer;
    }

    .ocr-table td.has-value {
      background: #e8f5e9;
      font-weight: bold;
    }

    .ocr-table td.low-conf {
      background: #fff3e0;
    }

    .ocr-table td.selected {
      outline: 2px solid #1a73e8;
      outline-offset: -2px;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    .cell-preview {
      width: 100%;
      background: #fafafa;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .cell-preview-header {
      font-size: 0.85rem;
      font-weight: 500;
      color: #333;
    }

    .cell-preview-img {
      image-rendering: pixelated;
      border: 1px solid #ccc;
      background: white;
    }

    .cell-preview-details {
      font-size: 0.8rem;
      color: #666;
    }

    .controls {
      display: flex;
      gap: 12px;
      padding: 8px 0;
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
    }

    .done-btn {
      background: #1a73e8;
      color: white;
    }
  `;

  @property({ type: Number }) captureId = 0;

  @state() private _processState: ProcessState = 'loading-cv';
  @state() private _error = '';
  @state() private _markers: DetectedMarker[] = [];
  @state() private _resultUrl = '';
  @state() private _ocrResults: OCRResult[] = [];
  @state() private _ocrProgress = '';
  @state() private _selectedCellId = '';

  /** Map of cellId → data URL for the raw cropped ROI image */
  private _roiImages = new Map<string, string>();
  /** Map of cellId → data URL for the preprocessed ROI image */
  private _roiPreprocessed = new Map<string, string>();

  connectedCallback(): void {
    super.connectedCallback();
    this._process();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._resultUrl) {
      URL.revokeObjectURL(this._resultUrl);
    }
  }

  private _imageDataToDataUrl(data: ImageData): string {
    const canvas = document.createElement('canvas');
    canvas.width = data.width;
    canvas.height = data.height;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(data, 0, 0);
    return canvas.toDataURL('image/png');
  }

  private async _process(): Promise<void> {
    try {
      // Load OpenCV
      this._processState = 'loading-cv';
      const cv = await loadOpenCV();

      // Load the captured image
      const capture = await getCapture(this.captureId);
      if (!capture) {
        this._error = 'Capture not found in database.';
        this._processState = 'error';
        return;
      }

      // Convert blob to ImageData via canvas
      const imageBitmap = await createImageBitmap(capture.blob);
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imageBitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Convert to cv.Mat
      const src = cv.matFromImageData(imageData);

      try {
        // Detect ArUco markers
        this._processState = 'detecting';
        this._markers = detectMarkers(cv, src);

        if (this._markers.length < 4) {
          const found = this._markers.map((m) => m.id).join(', ');
          this._error = `Found ${this._markers.length}/4 markers${found ? ` (IDs: ${found})` : ''}. Need all 4 corner markers (IDs 0–3). Ensure the form is fully visible and well-lit.`;
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

          // Extract ROIs
          this._processState = 'extracting';
          const allCells = [MANIFEST_SCHEMA.tracking, ...MANIFEST_SCHEMA.digitBoxes];
          const rois = extractROIs(cv, result.corrected, allCells);

          // Store ROI images for preview
          for (const roi of rois) {
            this._roiImages.set(roi.cell.id, this._imageDataToDataUrl(roi.imageData));
            this._roiPreprocessed.set(roi.cell.id, this._imageDataToDataUrl(roi.preprocessedData));
          }

          // Run OCR
          this._processState = 'ocr';
          this._ocrResults = await recognizeCells(rois, (done, total) => {
            this._ocrProgress = `${done}/${total} cells`;
          });

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
        detail: { results: this._ocrResults },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _selectCell(cellId: string): void {
    this._selectedCellId = this._selectedCellId === cellId ? '' : cellId;
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
        return this._renderSpinner('Extracting cells...');
      case 'ocr':
        return this._renderSpinner(`Running OCR... ${this._ocrProgress}`);
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
    return html`
      <div class="spinner"></div>
      <p class="status">${msg}</p>
    `;
  }

  private _renderCellPreview() {
    if (!this._selectedCellId) return nothing;

    const rawUrl = this._roiImages.get(this._selectedCellId);
    const ppUrl = this._roiPreprocessed.get(this._selectedCellId);
    if (!rawUrl) return nothing;

    const result = this._ocrResults.find((r) => r.cellId === this._selectedCellId);
    const cell = [...MANIFEST_SCHEMA.digitBoxes, MANIFEST_SCHEMA.tracking].find(
      (c) => c.id === this._selectedCellId,
    );

    return html`
      <div class="cell-preview">
        <div class="cell-preview-header">
          ${cell?.col || this._selectedCellId}
          ${cell?.row && cell.row !== 'tracking' ? ` (${cell.row})` : ''}
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; justify-content:center;">
          <div style="text-align:center">
            <div style="font-size:0.7rem; color:#999; margin-bottom:2px">Raw</div>
            <img class="cell-preview-img" src=${rawUrl} alt="Raw crop"
              style="max-width:45%; height:auto; min-height:30px;" />
          </div>
          ${ppUrl ? html`
            <div style="text-align:center">
              <div style="font-size:0.7rem; color:#999; margin-bottom:2px">Preprocessed</div>
              <img class="cell-preview-img" src=${ppUrl} alt="Preprocessed"
                style="max-width:45%; height:auto; min-height:30px;" />
            </div>
          ` : nothing}
        </div>
        <div class="cell-preview-details">
          OCR: "${result?.text || ''}" | Confidence: ${result?.confidence?.toFixed(0) ?? '?'}%
        </div>
      </div>
    `;
  }

  private _renderResults() {
    const trackingResult = this._ocrResults.find((r) => r.cellId === 'tracking_no');
    const digitResults = this._ocrResults.filter((r) => r.cellId !== 'tracking_no');

    // Assemble digit results into field values
    const digitMap = new Map<string, string>();
    for (const r of digitResults) {
      digitMap.set(r.cellId, r.text);
    }
    const fieldValues = assembleFieldValues(digitMap);

    // Compute average confidence per field
    const fieldConfidence = new Map<string, number>();
    const fieldDigits = new Map<string, number[]>();
    for (const r of digitResults) {
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

        <div
          class="info-bar"
          style="cursor: pointer"
          @click=${() => this._selectCell('tracking_no')}
        >
          Markers: ${this._markers.length}/4 |
          Tracking No: <strong>${trackingResult?.text || '—'}</strong>
          <span style="float:right; font-size:0.75rem; color:#999">tap to preview</span>
        </div>

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
                const label =
                  row === 'received'
                    ? 'Received'
                    : row === 'gross_kg'
                      ? 'Gross KG'
                      : 'Nett KG';
                return html`
                  <tr>
                    <td class="row-header">${label}</td>
                    ${columns.map((col) => {
                      const fieldId = `${row}_${col.replace(/[\s.]/g, '_')}`;
                      const val = fieldValues.get(fieldId) || '';
                      const conf = fieldConfidence.get(fieldId) ?? 0;
                      const isSelected = this._selectedCellId.startsWith(fieldId);
                      // Show first digit box for this field when clicked
                      const firstBoxId = `${fieldId}_d0`;
                      let cls = 'clickable';
                      if (val && val !== '000' && val !== '000,0')
                        cls += conf < 50 ? ' has-value low-conf' : ' has-value';
                      if (isSelected) cls += ' selected';
                      return html`<td
                        class=${cls}
                        @click=${() => this._selectCell(firstBoxId)}
                      >${val || '—'}</td>`;
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
