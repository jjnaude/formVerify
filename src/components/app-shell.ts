import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './camera-capture.js';
import './image-processor.js';

type AppView = 'home' | 'camera' | 'processing';

@customElement('app-shell')
export class AppShell extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    header {
      background: #1a73e8;
      color: white;
      padding: 12px 16px;
      font-size: 1.25rem;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .back-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
    }

    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      gap: 16px;
    }

    .capture-btn {
      background: #1a73e8;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 16px 32px;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .capture-btn:active {
      background: #1557b0;
    }

    .info {
      color: #666;
      text-align: center;
      line-height: 1.6;
    }

    camera-capture,
    image-processor {
      flex: 1;
      width: 100%;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 0.9rem;
      z-index: 100;
      animation: fade-in-out 2.5s ease-in-out forwards;
    }

    @keyframes fade-in-out {
      0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
      15% { opacity: 1; transform: translateX(-50%) translateY(0); }
      75% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
  `;

  @state() private _view: AppView = 'home';
  @state() private _toast = '';
  @state() private _captureId = 0;

  private _showCamera(): void {
    this._view = 'camera';
  }

  private _goHome(): void {
    this._view = 'home';
  }

  private _onCaptureSaved(e: CustomEvent<{ id: number }>): void {
    this._captureId = e.detail.id;
    this._view = 'processing';
  }

  private _onProcessingComplete(): void {
    this._toast = 'Form processed successfully';
    this._view = 'home';
    setTimeout(() => {
      this._toast = '';
    }, 2500);
  }

  render() {
    return html`
      <header>
        ${this._view !== 'home'
          ? html`<button class="back-btn" @click=${this._goHome} aria-label="Back">&larr;</button>`
          : ''}
        formVerify
      </header>

      ${this._view === 'home' ? this._renderHome() : ''}
      ${this._view === 'camera' ? this._renderCamera() : ''}
      ${this._view === 'processing' ? this._renderProcessing() : ''}
      ${this._toast ? html`<div class="toast">${this._toast}</div>` : ''}
    `;
  }

  private _renderHome() {
    return html`
      <main>
        <button class="capture-btn" @click=${this._showCamera}>
          Capture Form
        </button>
        <p class="info">
          Take a photo of a waste manifest form<br />
          to begin verification.
        </p>
      </main>
    `;
  }

  private _renderCamera() {
    return html`
      <camera-capture @capture-saved=${this._onCaptureSaved}></camera-capture>
    `;
  }

  private _renderProcessing() {
    return html`
      <image-processor
        .captureId=${this._captureId}
        @processing-complete=${this._onProcessingComplete}
      ></image-processor>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-shell': AppShell;
  }
}
