import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth-guard.guard';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';

export const HomeRoutes: Routes = [
  { path: '', redirectTo: APP_ROUTES_PATH.home, pathMatch: 'full' },
  { 
    path: '', 
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
    canActivate: [AuthGuard] 
  },
];