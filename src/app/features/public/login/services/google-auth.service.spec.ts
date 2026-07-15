import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GoogleAuthService } from './google-auth.service';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

type GoogleWindow = typeof window & {
  google: {
    accounts: {
      id: {
        initialize: jasmine.Spy;
        renderButton: jasmine.Spy;
        prompt: jasmine.Spy;
      };
    };
  };
};

function mockGoogleSDK(): void {
  (window as GoogleWindow).google = {
    accounts: {
      id: {
        initialize: jasmine.createSpy('initialize'),
        renderButton: jasmine.createSpy('renderButton'),
        prompt: jasmine.createSpy('prompt'),
      },
    },
  };
}

function removeGoogleSDK(): void {
  (window as unknown as Record<string, unknown>)['google'] = undefined;
}

function createSignInDiv(id = 'signInDiv'): HTMLElement {
  const div = document.createElement('div');
  div.id = id;
  document.body.appendChild(div);
  return div;
}

// ─────────────────────────────────────────────────────────────────────────────
// Suite
// ─────────────────────────────────────────────────────────────────────────────

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;

  beforeEach(() => {
    mockGoogleSDK();
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAuthService);
  });

  afterEach(() => {
    // Clean up any injected script tags
    document.querySelectorAll(`script[src*="accounts.google.com/gsi/client"]`).forEach(el => el.remove());
    document.getElementById('google-gsi-script')?.remove();
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  describe('creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  // ── waitForGoogleSDK ──────────────────────────────────────────────────────

  describe('waitForGoogleSDK()', () => {
    it('should resolve immediately when google SDK is already available', async () => {
      await expectAsync(service.waitForGoogleSDK()).toBeResolved();
    });

    it('should resolve after SDK becomes available on a later poll', fakeAsync(async () => {
      removeGoogleSDK();

      let resolved = false;
      const promise = service.waitForGoogleSDK(5, 100).then(() => { resolved = true; });

      // SDK not yet available
      tick(100);
      expect(resolved).toBeFalse();

      // Make SDK available
      mockGoogleSDK();
      tick(100);
      await promise;
      expect(resolved).toBeTrue();
    }));

    it('should reject after maxRetries when SDK never loads', fakeAsync(async () => {
      removeGoogleSDK();

      let error: Error | undefined;
      const promise = service.waitForGoogleSDK(3, 100).catch(e => { error = e; });

      tick(300); // 3 retries × 100 ms
      await promise;

      expect(error).toBeDefined();
      expect(error!.message).toContain('Google Identity Services SDK');
    }));
  });

  // ── initAndRender ─────────────────────────────────────────────────────────

  describe('initAndRender()', () => {
    let signInDiv: HTMLElement;
    const callback = jasmine.createSpy('callback');

    beforeEach(() => {
      signInDiv = createSignInDiv();
    });

    afterEach(() => {
      signInDiv.remove();
    });

    it('should wait for SDK, initialize, render button, and prompt', async () => {
      spyOn(service, 'waitForGoogleSDK').and.returnValue(Promise.resolve());

      await service.initAndRender(callback, 'signInDiv');

      const { initialize, renderButton, prompt } = (window as GoogleWindow).google.accounts.id;
      expect(service.waitForGoogleSDK).toHaveBeenCalled();
      expect(initialize).toHaveBeenCalledWith(
        jasmine.objectContaining({ callback })
      );
      expect(renderButton).toHaveBeenCalledWith(signInDiv, jasmine.any(Object));
      expect(prompt).toHaveBeenCalled();
    });

    it('should pass the correct google client_id from environment', async () => {
      spyOn(service, 'waitForGoogleSDK').and.returnValue(Promise.resolve());

      await service.initAndRender(callback, 'signInDiv');

      const { initialize } = (window as GoogleWindow).google.accounts.id;
      const initArgs = initialize.calls.mostRecent().args[0];
      expect(initArgs.client_id).toBeTruthy();
    });

    it('should throw when the target DOM element does not exist', async () => {
      spyOn(service, 'waitForGoogleSDK').and.returnValue(Promise.resolve());

      await expectAsync(service.initAndRender(callback, 'nonExistentDiv'))
        .toBeRejectedWithError(/nonExistentDiv/);
    });

    it('should propagate rejection when waitForGoogleSDK fails', async () => {
      const sdkError = new Error('SDK timeout');
      spyOn(service, 'waitForGoogleSDK').and.returnValue(Promise.reject(sdkError));

      await expectAsync(service.initAndRender(callback, 'signInDiv'))
        .toBeRejectedWith(sdkError);
    });
  });

  // ── reloadScript ──────────────────────────────────────────────────────────

  describe('reloadScript()', () => {
    it('should remove an existing GSI script before injecting a new one', async () => {
      // Pre-inject a fake script
      const old = document.createElement('script');
      old.id = 'google-gsi-script';
      old.src = 'https://accounts.google.com/gsi/client';
      document.head.appendChild(old);

      spyOn(service, 'waitForGoogleSDK').and.returnValue(Promise.resolve());

      // Intercept script injection and simulate onload
      spyOn(document.head, 'appendChild').and.callFake((node: any) => {
        setTimeout(() => node.onload?.(), 0);
        return node;
      });

      await service.reloadScript();

      expect(document.getElementById('google-gsi-script')).toBeNull();
      expect(service.waitForGoogleSDK).toHaveBeenCalled();
    });

    it('should reject when the new script fails to load', async () => {
      spyOn(document.head, 'appendChild').and.callFake((node: any) => {
        setTimeout(() => node.onerror?.(), 0);
        return node;
      });

      await expectAsync(service.reloadScript())
        .toBeRejectedWithError(/Google Identity Services/);
    });

    it('should call waitForGoogleSDK after successful script load', async () => {
      spyOn(service, 'waitForGoogleSDK').and.returnValue(Promise.resolve());
      spyOn(document.head, 'appendChild').and.callFake((node: any) => {
        setTimeout(() => node.onload?.(), 0);
        return node;
      });

      await service.reloadScript();

      expect(service.waitForGoogleSDK).toHaveBeenCalledWith(20, 250);
    });
  });
});
