import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistsService } from '@core/services/playlists.service';
import { Playlist } from '@core/models/playlist.model';
import { NuevaPlaylistModalComponent } from '../nueva-playlist-modal/nueva-playlist-modal.component';

@Component({
  selector: 'app-lista-playlists',
  standalone: true,
  imports: [CommonModule, NuevaPlaylistModalComponent],
  templateUrl: './lista-playlists.component.html',
  styleUrl: './lista-playlists.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPlaylistsComponent implements OnInit {
  private readonly playlistsService = inject(PlaylistsService);
  private readonly router = inject(Router);

  playlists = signal<Playlist[]>([]);
  modalVisible = signal(false);

  ngOnInit(): void {
    this.playlistsService.getAll().subscribe(data => this.playlists.set(data));
  }

  verPlaylist(id: number): void {
    this.router.navigate(['public', 'home', 'playlist', id]);
  }

  crearPlaylist(nombre: string): void {
    const nuevaPlaylist = { nombre, fechaCreacion: new Date(), canciones: [] };
    this.playlistsService.create(nuevaPlaylist).subscribe(playlist => {
      this.playlists.update(lista => [...lista, playlist]);
      this.modalVisible.set(false);
    });
  }
}
