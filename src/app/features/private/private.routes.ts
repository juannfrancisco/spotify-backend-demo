import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth-guard.guard';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';

export const PrivateRoutes: Routes = [
  { path: '', redirectTo: APP_ROUTES_PATH.home, pathMatch: 'full' },
  { 
    path: APP_ROUTES_PATH.home, 
    loadChildren: () => import('./home/home.routes').then(r => r.HomeRoutes),
    canActivate: [AuthGuard] 
  },
  { 
    path: APP_ROUTES_PATH.generic, 
    loadChildren: () => import('./generic/generic.routes').then(r => r.GenericRoutes),
    canActivate: [AuthGuard]
  },
];