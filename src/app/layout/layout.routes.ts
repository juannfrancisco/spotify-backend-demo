import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';

export const LayoutRoutes: Routes = [

      { path: '', redirectTo: APP_ROUTES_PATH.home, pathMatch: 'full' },
      {
        path: '',
        component: LayoutComponent,
        loadChildren: () => import('../features/private/private.routes').then(m => m.PrivateRoutes),
      },
      { path: '**', redirectTo: 'error/404' },
];
