import { Injectable } from '@angular/core';
import { environment } from '@env';

declare let google: any;

const GSI_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const GSI_SCRIPT_ID = 'google-gsi-script';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {

  /**
   * Waits for the Google Identity Services SDK to be available.
   * Polls every `interval` ms up to `maxRetries` times.
   */
  waitForGoogleSDK(maxRetries = 20, interval = 250): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const check = () => {
        if (typeof google !== 'undefined' && google.accounts?.id) {
          resolve();
        } else if (++attempts >= maxRetries) {
          reject(new Error('Google Identity Services SDK no se cargó después de ' + (maxRetries * interval / 1000) + ' segundos'));
        } else {
          setTimeout(check, interval);
        }
      };
      check();
    });
  }

  /**
   * Full initialization flow: wait for SDK, initialize, render button, and prompt.
   * @param callback  Credential response handler
   * @param elementId DOM element ID where the button will be rendered
   */
  async initAndRender(callback: (response: any) => void, elementId: string): Promise<void> {
    await this.waitForGoogleSDK();
    this.initializeGoogleAuth(callback);
    this.renderButton(elementId);
    this.prompt();
  }

  /**
   * Removes the existing GSI script tag, re-injects it, and waits for the SDK again.
   * Useful as a retry mechanism in PWAs where page reload is not always possible.
   */
  async reloadScript(): Promise<void> {
    // Remove existing script if present
    const existing = document.getElementById(GSI_SCRIPT_ID);
    if (existing) {
      existing.remove();
    }

    // Also remove any script matching the GSI URL (e.g., the original in index.html)
    document.querySelectorAll(`script[src*="accounts.google.com/gsi/client"]`).forEach(el => el.remove());

    // Inject a fresh script tag
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.id = GSI_SCRIPT_ID;
      script.src = GSI_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar el script de Google Identity Services'));
      document.head.appendChild(script);
    });

    // Wait for the global `google` object to be ready
    await this.waitForGoogleSDK(20, 250);
  }

  private initializeGoogleAuth(callback: (response: any) => void): void {
    google.accounts.id.initialize({
      client_id: environment.googleAuthClientId,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm: true,
      hosted_domain: 'zentagroup.com',
    });
  }

  private renderButton(elementId: string = 'signInDiv') {
    const container = document.getElementById(elementId);
    if (!container) {
      throw new Error(`Elemento #${elementId} no encontrado en el DOM`);
    }
    google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
    });
  }

  private prompt() {
    google.accounts.id.prompt();
  }
}
