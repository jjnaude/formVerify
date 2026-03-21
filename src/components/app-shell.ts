import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

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
      padding: 16px;
      font-size: 1.25rem;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

    .status {
      font-size: 1.5rem;
    }

    .info {
      color: #666;
      text-align: center;
      line-height: 1.6;
    }
  `;

  render() {
    return html`
      <header>formVerify</header>
      <main>
        <p class="status">Ready</p>
        <p class="info">
          Phase 0 scaffold complete.<br />
          Camera capture coming in Phase 1.
        </p>
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-shell': AppShell;
  }
}
