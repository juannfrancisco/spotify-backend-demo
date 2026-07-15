import { Routes } from '@angular/router';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';

export const PublicRoutes: Routes = [
  { path: '', redirectTo: APP_ROUTES_PATH.home, pathMatch: 'full' },
  {
    path: APP_ROUTES_PATH.home,
    loadChildren: () => import('./home/home.routes').then(r => r.HomeRoutes)
  },
  {
    path: APP_ROUTES_PATH.login,
    loadChildren: () => import('./login/login.routes').then(r => r.LoginRoutes)
  },
];