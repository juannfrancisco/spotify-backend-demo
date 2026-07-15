import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { DialogService } from './dialog.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(() => {
    const dialogSpy = jasmine.createSpyObj('DialogService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        { provide: DialogService, useValue: dialogSpy }
      ]
    });
    
    service = TestBed.inject(ErrorHandlerService);
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle network connection error (status 0)', () => {
    const progressEvent = new ProgressEvent('error');
    Object.defineProperty(progressEvent, 'type', { value: 'error' });
    
    const error = new HttpErrorResponse({
      status: 0,
      error: progressEvent
    });

    service.handleError(error);

    expect(dialogService.error).toHaveBeenCalledWith({
      title: 'Error',
      message: 'No se pudo establecer conexión con el servidor. Por favor, verifica que el servidor esté en funcionamiento y tu conexión a internet sea estable.',
      confirmText: 'Aceptar',
      showConfirmButton: true,
      showFooter: true
    });
  });

  it('should handle generic connection error (status 0)', () => {
    const error = new HttpErrorResponse({
      status: 0,
      error: {}
    });

    service.handleError(error);

    expect(dialogService.error).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.'
    }));
  });

  it('should handle bad request error (status 400)', () => {
    const error = new HttpErrorResponse({ status: 400 });

    service.handleError(error);

    expect(dialogService.error).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'La solicitud no pudo ser procesada. Por favor, verifica la información ingresada.'
    }));
  });

  it('should handle unauthorized error (status 401)', () => {
    const error = new HttpErrorResponse({ status: 401 });

    service.handleError(error);

    expect(dialogService.error).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    }));
  });

  it('should handle forbidden error (status 403)', () => {
    const error = new HttpErrorResponse({ status: 403 });

    service.handleError(error);

    expect(dialogService.error).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'No tienes permisos para realizar esta acción.'
    }));
  });

  it('should handle not found error (status 404)', () => {
    const error = new HttpErrorResponse({ status: 404 });

    service.handleError(error);

    expect(dialogService.error).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'El recurso solicitado no fue encontrado.'
    }));
  });

  it('should handle server errors (status 500-503)', () => {
    const serverStatuses = [500, 501, 502, 503];

    serverStatuses.forEach(status => {
      const error = new HttpErrorResponse({ status });
      dialogService.error.calls.reset();

      service.handleError(error);

      expect(dialogService.error).toHaveBeenCalledWith(jasmine.objectContaining({
        message: 'Ha ocurrido un problema en el servidor. Por favor, intenta más tarde.'
      }));
    });
  });

  it('should handle custom backend error message', () => {
    const error = new HttpErrorResponse({
      status: 422,
      error: { message: 'Custom backend error message' }
    });

    service.handleError(error);

    expect(dialogService.error).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Custom backend error message'
    }));
  });

  it('should handle unknown HTTP error', () => {
    const error = new HttpErrorResponse({ status: 999 });

    service.handleError(error);

    expect(dialogService.error).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
    }));
  });

  it('should handle generic Error objects', () => {
    const error = new Error('Generic error');

    service.handleError(error);

    expect(dialogService.error).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Ha ocurrido un error en la aplicación. Por favor, intenta nuevamente.'
    }));
  });

  it('should log errors in development mode', () => {
    spyOn(console, 'error');
    const originalProduction = (window as any).environment?.production;
    
    // Mock development environment
    (window as any).environment = { production: false };

    const error = new HttpErrorResponse({ status: 500 });
    service.handleError(error);

    expect(console.error).toHaveBeenCalledWith('Error técnico:', error);

    // Restore original environment
    if (originalProduction !== undefined) {
      (window as any).environment.production = originalProduction;
    }
  });
});
