import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { PlaylistPerfilComponent } from './pages/playlist-perfil/playlist-perfil.component';

export const HomeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: OverviewComponent },
      { path: 'playlist/:id', component: PlaylistPerfilComponent },
    ],
  },
];
