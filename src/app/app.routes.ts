import { Routes } from '@angular/router';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';
import { AuthGuard } from '@core/guards/auth-guard.guard';


export const routes: Routes = [
    { path: '', redirectTo: APP_ROUTES_PATH.public, pathMatch: 'full' },
  {
    path: APP_ROUTES_PATH.public,
    loadChildren: () => import('./features/public/public.routes').then(m => m.PublicRoutes)
  },
  {
    path: APP_ROUTES_PATH.private,
    loadChildren: () => import('./layout/layout.routes').then(m => m.LayoutRoutes),
    canActivate: [AuthGuard]
  }

];
