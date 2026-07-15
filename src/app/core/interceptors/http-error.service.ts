import { HttpEvent, HttpEventType, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '@core/auth/auth.service';
import { ErrorHandlerService } from '@core/services/error-handler.service';

export const HttpErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const errorHandlerService = inject(ErrorHandlerService);
  
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event.type === HttpEventType.Response) {
        const response = event;
        if (response.body?.statusCode && response.body?.statusCode !== 200 && response.body?.body) {
          const standardizedResponse = {
            code: response.body.statusCode,
            status: 'error',
            message: response.body.body
          };
          return response.clone({ body: standardizedResponse });
        }
      }
      return event;
    }),
    catchError((error) => {
      // Manejo de errores de autenticación
      if (error.status === HttpStatusCode.Unauthorized) {
        // Solo cerramos sesión si no es un error de red
        if (error.error && error.error.statusCode !== 0) {
          authService.logout();
        }
      }

      // Verificamos si el request tiene el header para omitir el manejo centralizado de errores
      const skipErrorHandling = req.headers.get('skip-error-handling') === 'true';
      
      // Utilizamos el servicio centralizado de manejo de errores
      // para mostrar mensajes amigables al usuario
      if (!skipErrorHandling) {
        errorHandlerService.handleError(error);
      }
      
      // Estandarizamos el error para el flujo de la aplicación
      let standardizedError: any;
      if (error.error?.statusCode && error.error?.body) {
        standardizedError = {
          code: error.error.statusCode,
          status: 'error',
          message: error.error.body
        };
      } else {
        // Si no tiene el formato esperado, creamos un error estándar
        standardizedError = {
          code: error.status ?? 500,
          status: 'error',
          message: 'Ha ocurrido un error inesperado'
        };
      }
      
      return throwError(() => standardizedError);
    })
  );
};
