import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth-guard.guard';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';

export const GenericRoutes: Routes = [
  { path: '', redirectTo: APP_ROUTES_PATH.genericForm, pathMatch: 'full' },
  { 
    path: APP_ROUTES_PATH.genericForm, 
    loadComponent: () => import('./pages/create-generic/create-generic.component').then(c => c.CreateGenericComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: APP_ROUTES_PATH.genericList, 
    loadComponent: () => import('./pages/list-generic/list-generic.component').then(c => c.ListGenericComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: `${APP_ROUTES_PATH.genericDetail}/:id`, 
    loadComponent: () => import('./pages/detail-generic/detail-generic.component').then(c => c.DetailGenericComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: `${APP_ROUTES_PATH.genericEdit}/:id`, 
    loadComponent: () => import('./pages/edit-generic/edit-generic.component').then(c => c.EditGenericComponent),
    canActivate: [AuthGuard] 
  },
];