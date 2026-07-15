import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';
import { SYSTEM_ENDPOINTS } from '@shared/constants/endpoints.constants';
import { environment } from '@env';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const isLoginRequest = req.url.includes(`${environment.apiEndpoint}/${SYSTEM_ENDPOINTS.login}`);
  
  if (req.url.includes(environment.apiEndpoint)) {
    const token = authService.getToken();
    const csrfToken = authService.getCsrfToken();
    
    if (token && !isLoginRequest) {
      let headers = req.headers.set('Authorization', `Bearer ${token}`);
      
      // Agregar x-csrf-token si está disponible
      if (csrfToken) {
        headers = headers.set('x-csrf-token', csrfToken);
      }
      
      const authReq = req.clone({ headers });
      return next(authReq);
    }
  }

  return next(req);
};