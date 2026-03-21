import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { saveCapture } from '../utils/db.js';

type CameraState = 'idle' | 'streaming' | 'preview' | 'error';

@customElement('camera-capture')
export class CameraCapture extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .viewfinder {
      position: relative;
      width: 100%;
      max-width: 600px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      overflow: hidden;
    }

    video,
    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    /* A4 portrait guide overlay */
    .overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .guide {
      /* A4 ratio 210:297 ≈ 0.707 */
      width: 70%;
      aspect-ratio: 210 / 297;
      border: 2px dashed rgba(255, 255, 255, 0.6);
      border-radius: 4px;
    }

    .corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: rgba(255, 255, 255, 0.9);
      border-style: solid;
      border-width: 0;
    }

    .corner.tl {
      top: 0;
      left: 0;
      border-top-width: 3px;
      border-left-width: 3px;
    }
    .corner.tr {
      top: 0;
      right: 0;
      border-top-width: 3px;
      border-right-width: 3px;
    }
    .corner.bl {
      bottom: 0;
      left: 0;
      border-bottom-width: 3px;
      border-left-width: 3px;
    }
    .corner.br {
      bottom: 0;
      right: 0;
      border-bottom-width: 3px;
      border-right-width: 3px;
    }

    .controls {
      display: flex;
      gap: 16px;
      padding: 16px;
      justify-content: center;
      width: 100%;
      max-width: 600px;
    }

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .capture-btn {
      background: #1a73e8;
      color: white;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      padding: 0;
      border: 4px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .capture-btn:active {
      background: #1557b0;
    }

    .retake-btn {
      background: #e0e0e0;
      color: #333;
    }

    .accept-btn {
      background: #34a853;
      color: white;
    }

    .start-btn {
      background: #1a73e8;
      color: white;
    }

    .error-msg {
      color: #d93025;
      padding: 24px;
      text-align: center;
    }

    .message {
      color: #666;
      padding: 24px;
      text-align: center;
    }
  `;

  @state() private _state: CameraState = 'idle';
  @state() private _error = '';
  @state() private _previewUrl = '';

  @query('video') private _video!: HTMLVideoElement;

  private _stream: MediaStream | null = null;
  private _capturedBlob: Blob | null = null;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopStream();
    this._revokePreview();
  }

  private async _startCamera(): Promise<void> {
    try {
      this._stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 3840 },
          height: { ideal: 2160 },
        },
        audio: false,
      });
      this._state = 'streaming';
      await this.updateComplete;
      this._video.srcObject = this._stream;
    } catch (err) {
      this._error =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access and try again.'
          : 'Could not access camera. Ensure a camera is available.';
      this._state = 'error';
    }
  }

  private _stopStream(): void {
    if (this._stream) {
      for (const track of this._stream.getTracks()) {
        track.stop();
      }
      this._stream = null;
    }
  }

  private _revokePreview(): void {
    if (this._previewUrl) {
      URL.revokeObjectURL(this._previewUrl);
      this._previewUrl = '';
    }
  }

  private async _capture(): Promise<void> {
    const video = this._video;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);

    this._capturedBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
        'image/jpeg',
        0.92,
      );
    });

    this._stopStream();
    this._revokePreview();
    this._previewUrl = URL.createObjectURL(this._capturedBlob);
    this._state = 'preview';
  }

  private _retake(): void {
    this._revokePreview();
    this._capturedBlob = null;
    this._startCamera();
  }

  private async _accept(): Promise<void> {
    if (!this._capturedBlob) return;
    const id = await saveCapture(this._capturedBlob);
    this._revokePreview();
    this._capturedBlob = null;
    this._state = 'idle';
    this.dispatchEvent(
      new CustomEvent('capture-saved', { detail: { id }, bubbles: true, composed: true }),
    );
  }

  render() {
    switch (this._state) {
      case 'idle':
        return html`
          <div class="viewfinder">
            <p class="message">Tap the button below to start the camera</p>
          </div>
          <div class="controls">
            <button class="start-btn" @click=${this._startCamera}>Open Camera</button>
          </div>
        `;

      case 'streaming':
        return html`
          <div class="viewfinder">
            <video autoplay playsinline muted></video>
            <div class="overlay">
              <div class="guide">
                <div class="corner tl"></div>
                <div class="corner tr"></div>
                <div class="corner bl"></div>
                <div class="corner br"></div>
              </div>
            </div>
          </div>
          <div class="controls">
            <button class="capture-btn" @click=${this._capture} aria-label="Capture photo"></button>
          </div>
        `;

      case 'preview':
        return html`
          <div class="viewfinder">
            <img class="preview-img" src=${this._previewUrl} alt="Captured photo" />
          </div>
          <div class="controls">
            <button class="retake-btn" @click=${this._retake}>Retake</button>
            <button class="accept-btn" @click=${this._accept}>Accept</button>
          </div>
        `;

      case 'error':
        return html`
          <p class="error-msg">${this._error}</p>
          <div class="controls">
            <button class="start-btn" @click=${this._startCamera}>Try Again</button>
          </div>
        `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'camera-capture': CameraCapture;
  }
}
