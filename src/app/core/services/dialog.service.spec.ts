import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ViewContainerRef, ComponentRef, EventEmitter } from '@angular/core';
import { DialogService, DialogConfig } from './dialog.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

describe('DialogService', () => {
  let service: DialogService;
  let mockViewContainerRef: jasmine.SpyObj<ViewContainerRef>;
  let mockComponentRef: jasmine.SpyObj<ComponentRef<DialogComponent>>;
  let mockDialogInstance: any;
  let mockCloseEmitter: EventEmitter<void>;
  let mockConfirmEmitter: EventEmitter<void>;

  beforeEach(() => {
    mockCloseEmitter = new EventEmitter<void>();
    mockConfirmEmitter = new EventEmitter<void>();

    mockDialogInstance = {
      title: '',
      message: '',
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      showConfirmButton: true,
      showCancelButton: false,
      showFooter: true,
      isOpen: false,
      close: mockCloseEmitter,
      confirm: mockConfirmEmitter,
    };

    mockComponentRef = jasmine.createSpyObj('ComponentRef', ['destroy'], {
      instance: mockDialogInstance,
    });

    mockViewContainerRef = jasmine.createSpyObj('ViewContainerRef', ['createComponent']);
    mockViewContainerRef.createComponent.and.returnValue(mockComponentRef);

    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setViewContainerRef', () => {
    it('should store the provided ViewContainerRef', () => {
      service.setViewContainerRef(mockViewContainerRef);
      expect(service['viewContainerRef']).toBe(mockViewContainerRef);
    });
  });

  describe('createDialog (via alert)', () => {
    it('should throw when ViewContainerRef is not set', () => {
      expect(() => service.alert({ title: 'Test' }))
        .toThrowError('ViewContainerRef not set. Call setViewContainerRef first.');
    });

    it('should set dialog instance properties from config', () => {
      service.setViewContainerRef(mockViewContainerRef);
      const config: DialogConfig = {
        title: 'My Title',
        message: 'My Message',
        confirmText: 'OK',
        cancelText: 'No',
        showCancelButton: true,
      };

      service.alert(config);

      expect(mockDialogInstance.title).toBe('My Title');
      expect(mockDialogInstance.message).toBe('My Message');
      expect(mockDialogInstance.confirmText).toBe('OK');
      expect(mockDialogInstance.cancelText).toBe('No');
      expect(mockDialogInstance.showCancelButton).toBe(true);
      expect(mockDialogInstance.isOpen).toBe(true);
    });

    it('should apply default values when config properties are omitted', () => {
      service.setViewContainerRef(mockViewContainerRef);
      service.alert({});

      expect(mockDialogInstance.title).toBe('');
      expect(mockDialogInstance.message).toBe('');
      expect(mockDialogInstance.confirmText).toBe('Aceptar');
      expect(mockDialogInstance.cancelText).toBe('Cancelar');
      expect(mockDialogInstance.showConfirmButton).toBe(true);
      expect(mockDialogInstance.showFooter).toBe(true);
      expect(mockDialogInstance.showCancelButton).toBe(false);
    });

    it('should set isOpen to false and destroy component after close event', fakeAsync(() => {
      service.setViewContainerRef(mockViewContainerRef);
      service.alert({});

      mockCloseEmitter.emit();

      expect(mockDialogInstance.isOpen).toBe(false);
      tick(100);
      expect(mockComponentRef.destroy).toHaveBeenCalled();
    }));

    it('should set isOpen to false and destroy component after confirm event', fakeAsync(() => {
      service.setViewContainerRef(mockViewContainerRef);
      service.alert({});

      mockConfirmEmitter.emit();

      expect(mockDialogInstance.isOpen).toBe(false);
      tick(100);
      expect(mockComponentRef.destroy).toHaveBeenCalled();
    }));

    it('should call onClose callback when dialog closes', fakeAsync(() => {
      service.setViewContainerRef(mockViewContainerRef);
      const onClose = jasmine.createSpy('onClose');
      service.alert({ onClose });

      mockCloseEmitter.emit();
      tick(100);

      expect(onClose).toHaveBeenCalledTimes(1);
    }));

    it('should not call onClose callback when it is not provided', fakeAsync(() => {
      service.setViewContainerRef(mockViewContainerRef);
      expect(() => {
        service.alert({});
        mockCloseEmitter.emit();
        tick(100);
      }).not.toThrow();
    }));
  });

  describe('alert', () => {
    it('should resolve when confirm is emitted', fakeAsync(() => {
      service.setViewContainerRef(mockViewContainerRef);
      let resolved = false;

      service.alert({ title: 'Alert' }).then(() => (resolved = true));
      mockConfirmEmitter.emit();
      tick(100);

      expect(resolved).toBe(true);
    }));

    it('should force showFooter to true', () => {
      service.setViewContainerRef(mockViewContainerRef);
      service.alert({ showFooter: false });
      expect(mockDialogInstance.showFooter).toBe(true);
    });
  });

  describe('confirm', () => {
    it('should resolve true when confirm is emitted', fakeAsync(() => {
      service.setViewContainerRef(mockViewContainerRef);
      let result: boolean | undefined;

      service.confirm({ title: 'Confirm?' }).then((v) => (result = v));
      mockConfirmEmitter.emit();
      tick(100);

      expect(result).toBe(true);
    }));

    it('should resolve false when close is emitted', fakeAsync(() => {
      service.setViewContainerRef(mockViewContainerRef);
      let result: boolean | undefined;

      service.confirm({ title: 'Confirm?' }).then((v) => (result = v));
      mockCloseEmitter.emit();
      tick(100);

      expect(result).toBe(false);
    }));

    it('should show cancel button by default', () => {
      service.setViewContainerRef(mockViewContainerRef);
      service.confirm({});
      expect(mockDialogInstance.showCancelButton).toBe(true);
    });

    it('should respect explicit showCancelButton: false', () => {
      service.setViewContainerRef(mockViewContainerRef);
      service.confirm({ showCancelButton: false });
      expect(mockDialogInstance.showCancelButton).toBe(false);
    });

    it('should force showFooter and showConfirmButton to true', () => {
      service.setViewContainerRef(mockViewContainerRef);
      service.confirm({ showFooter: false, showConfirmButton: false });
      expect(mockDialogInstance.showFooter).toBe(true);
      expect(mockDialogInstance.showConfirmButton).toBe(true);
    });
  });

  describe('info', () => {
    it('should resolve when confirm is emitted', fakeAsync(() => {
      service.setViewContainerRef(mockViewContainerRef);
      let resolved = false;

      service.info({ title: 'Info' }).then(() => (resolved = true));
      mockConfirmEmitter.emit();
      tick(100);

      expect(resolved).toBe(true);
    }));

    it('should pass title and message through', () => {
      service.setViewContainerRef(mockViewContainerRef);
      service.info({ title: 'My Info', message: 'Details here' });

      expect(mockDialogInstance.title).toBe('My Info');
      expect(mockDialogInstance.message).toBe('Details here');
    });
  });

  describe('error', () => {
    it('should use default title "Error" when title is omitted', () => {
      service.setViewContainerRef(mockViewContainerRef);
      service.error({ message: 'Something went wrong' });
      expect(mockDialogInstance.title).toBe('Error');
    });

    it('should use default confirmText "Entendido" when confirmText is omitted', () => {
      service.setViewContainerRef(mockViewContainerRef);
      service.error({});
      expect(mockDialogInstance.confirmText).toBe('Entendido');
    });

    it('should respect custom title when provided', () => {
      service.setViewContainerRef(mockViewContainerRef);
      service.error({ title: 'Custom Error' });
      expect(mockDialogInstance.title).toBe('Custom Error');
    });

    it('should respect custom confirmText when provided', () => {
      service.setViewContainerRef(mockViewContainerRef);
      service.error({ confirmText: 'Got it' });
      expect(mockDialogInstance.confirmText).toBe('Got it');
    });

    it('should resolve when confirm is emitted', fakeAsync(() => {
      service.setViewContainerRef(mockViewContainerRef);
      let resolved = false;

      service.error({ message: 'Error' }).then(() => (resolved = true));
      mockConfirmEmitter.emit();
      tick(100);

      expect(resolved).toBe(true);
    }));
  });
});
