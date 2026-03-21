import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadOpenCV } from '../utils/opencv-loader.js';
import { detectMarkers, type DetectedMarker } from '../pipeline/aruco-detector.js';
import { correctPerspective, matToBlob } from '../pipeline/perspective.js';
import { getCapture, saveCapture, updateCaptureStatus } from '../utils/db.js';

type ProcessState = 'loading-cv' | 'detecting' | 'correcting' | 'done' | 'error';

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
      max-height: 60vh;
      object-fit: contain;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .marker-info {
      font-size: 0.9rem;
      color: #333;
      background: #f0f0f0;
      padding: 8px 16px;
      border-radius: 4px;
      width: 100%;
    }

    .controls {
      display: flex;
      gap: 12px;
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

  /** IndexedDB capture ID to process. */
  @property({ type: Number }) captureId = 0;

  @state() private _processState: ProcessState = 'loading-cv';
  @state() private _error = '';
  @state() private _markers: DetectedMarker[] = [];
  @state() private _resultUrl = '';
  @state() private _correctedId: number | null = null;

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
          this._correctedId = await saveCapture(correctedBlob);
          await updateCaptureStatus(this.captureId, 'processed');

          // Show result
          this._resultUrl = URL.createObjectURL(correctedBlob);
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
        detail: { correctedId: this._correctedId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    switch (this._processState) {
      case 'loading-cv':
        return html`
          <div class="spinner"></div>
          <p class="status">Loading OpenCV...</p>
        `;
      case 'detecting':
        return html`
          <div class="spinner"></div>
          <p class="status">Detecting ArUco markers...</p>
        `;
      case 'correcting':
        return html`
          <div class="spinner"></div>
          <p class="status">Correcting perspective...</p>
        `;
      case 'error':
        return html`
          <p class="status error">${this._error}</p>
          <div class="controls">
            <button class="done-btn" @click=${this._done}>Back</button>
          </div>
        `;
      case 'done':
        return html`
          <div class="results">
            <p class="status">Perspective correction complete</p>
            <img class="result-img" src=${this._resultUrl} alt="Corrected form" />
            <div class="marker-info">
              Detected ${this._markers.length} markers
              (IDs: ${this._markers.map((m) => m.id).join(', ')})
            </div>
            <div class="controls">
              <button class="done-btn" @click=${this._done}>Done</button>
            </div>
          </div>
        `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'image-processor': ImageProcessor;
  }
}
