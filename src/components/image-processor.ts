import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadOpenCV } from '../utils/opencv-loader.js';
import { detectMarkers, type DetectedMarker } from '../pipeline/aruco-detector.js';
import { correctPerspective, matToBlob } from '../pipeline/perspective.js';
import { extractROIs } from '../pipeline/roi-extractor.js';
import { recognizeCells, type OCRResult } from '../pipeline/ocr.js';
import { MANIFEST_SCHEMA } from '../models/form-schema.js';
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

    .ocr-table td.has-value {
      background: #e8f5e9;
      font-weight: bold;
    }

    .ocr-table td.low-conf {
      background: #fff3e0;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
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

    .progress {
      font-size: 0.85rem;
      color: #1a73e8;
    }
  `;

  @property({ type: Number }) captureId = 0;

  @state() private _processState: ProcessState = 'loading-cv';
  @state() private _error = '';
  @state() private _markers: DetectedMarker[] = [];
  @state() private _resultUrl = '';
  @state() private _ocrResults: OCRResult[] = [];
  @state() private _ocrProgress = '';

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
          const allCells = [MANIFEST_SCHEMA.tracking, ...MANIFEST_SCHEMA.table];
          const rois = extractROIs(cv, result.corrected, allCells);

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

  private _renderResults() {
    const trackingResult = this._ocrResults.find((r) => r.cellId === 'tracking_no');
    const tableResults = this._ocrResults.filter((r) => r.cellId !== 'tracking_no');

    // Group by row
    const rows = ['received', 'gross_kg', 'nett_kg'];
    const columns = MANIFEST_SCHEMA.table
      .filter((c) => c.row === 'received')
      .map((c) => c.col);

    return html`
      <div class="results">
        <img class="result-img" src=${this._resultUrl} alt="Corrected form" />

        <div class="info-bar">
          Markers: ${this._markers.length}/4 |
          Tracking No: <strong>${trackingResult?.text || '—'}</strong>
        </div>

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
                      const r = tableResults.find(
                        (r) => r.row === row && r.col === col,
                      );
                      const val = r?.text || '';
                      const cls = val
                        ? r!.confidence < 50
                          ? 'has-value low-conf'
                          : 'has-value'
                        : '';
                      return html`<td class=${cls}>${val || '—'}</td>`;
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
