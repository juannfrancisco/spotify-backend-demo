import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListaPlaylistsComponent } from '../../components/lista-playlists/lista-playlists.component';
import { ListaArtistasComponent } from '../../components/lista-artistas/lista-artistas.component';
import { ListaCancionesComponent } from '../../components/lista-canciones/lista-canciones.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ListaPlaylistsComponent, ListaArtistasComponent, ListaCancionesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
