import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingService } from "@core/services/loading.service";
import { Observable, finalize } from "rxjs";

export const LoadingInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const loadingService = inject(LoadingService);
  const skipLoading = req.headers.get('X-Skip-Loading') === 'true';

  if (!skipLoading) {
    loadingService.show();
  }
  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loadingService.hide();
      }
    })
  );
};