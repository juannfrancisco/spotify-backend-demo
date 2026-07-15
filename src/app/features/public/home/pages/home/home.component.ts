import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListaPlaylistsComponent } from '../../components/lista-playlists/lista-playlists.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, ListaPlaylistsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
