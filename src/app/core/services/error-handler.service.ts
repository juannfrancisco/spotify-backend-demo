import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '@core/services/dialog.service';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private readonly dialogService: DialogService) {}

  /**
   * Maneja errores HTTP y muestra mensajes amigables al usuario
   * mientras registra detalles técnicos solo para depuración
   */
  handleError(error: HttpErrorResponse | Error): void {
    // Registrar el error completo para depuración (solo en desarrollo)
    if (!environment.production) {
      console.error('Error técnico:', error);
    }

    // Determinar el mensaje amigable para mostrar al usuario
    const userFriendlyMessage = this.getUserFriendlyMessage(error);
    
    // Mostrar mensaje al usuario usando el servicio de diálogo
    this.dialogService.error({
      title: 'Error',
      message: userFriendlyMessage,
      confirmText: 'Aceptar',
      showConfirmButton: true,
      showFooter: true
    });
  }

  /**
   * Convierte errores técnicos en mensajes amigables para el usuario
   */
  private getUserFriendlyMessage(error: HttpErrorResponse | Error): string {
    // Si es un error HTTP
    if (error instanceof HttpErrorResponse) {
      // Manejar según el código de estado
      switch (error.status) {
        case 0:
          if (error.error instanceof ProgressEvent && error.error.type === 'error') {
            return 'No se pudo establecer conexión con el servidor. Por favor, verifica que el servidor esté en funcionamiento y tu conexión a internet sea estable.';
          }
          return 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.';
        case 400:
          return 'La solicitud no pudo ser procesada. Por favor, verifica la información ingresada.';
        case 401:
          return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        case 403:
          return 'No tienes permisos para realizar esta acción.';
        case 404:
          return 'El recurso solicitado no fue encontrado.';
        case 500:
        case 501:
        case 502:
        case 503:
          return 'Ha ocurrido un problema en el servidor. Por favor, intenta más tarde.';
        default:
          // Si el error tiene un mensaje personalizado del backend, usarlo
          if (error.error?.message) {
            return error.error.message;
          }
          return 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
      }
    }
    
    // Para otros tipos de errores
    return 'Ha ocurrido un error en la aplicación. Por favor, intenta nuevamente.';
  }
}