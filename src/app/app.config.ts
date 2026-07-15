import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, withInterceptors } from '@angular/common/http';
import { HttpErrorInterceptor } from '@core/interceptors/http-error.service';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '@env';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LoadingInterceptor } from '@core/interceptors/loading.interceptor';

// Función para obtener el token desde sessionStorage
export function tokenGetter() {
  return sessionStorage.getItem('token');
}


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    importProvidersFrom( AngularSvgIconModule.forRoot()),
    importProvidersFrom(NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', theme: {
      extendsFromRoot: true,
      height: '30px',
    },})),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withHashLocation()),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([HttpErrorInterceptor,AuthInterceptor,LoadingInterceptor])
    ),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: [environment.apiEndpoint],
          skipWhenExpired: true
        }
      })
    ),

  ]
};
