import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancionesService } from '@core/services/canciones.service';
import { PlaylistsService } from '@core/services/playlists.service';
import { Cancion } from '@core/models/cancion.model';
import { Playlist } from '@core/models/playlist.model';

@Component({
  selector: 'app-lista-canciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-canciones.component.html',
  styleUrl: './lista-canciones.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaCancionesComponent implements OnInit {
  private readonly cancionesService = inject(CancionesService);
  private readonly playlistsService = inject(PlaylistsService);

  canciones = signal<Cancion[]>([]);
  playlists = signal<Playlist[]>([]);
  menuAbiertoId = signal<number | null>(null);
  menuPos = signal<{ top: number; right: number }>({ top: 0, right: 0 });

  ngOnInit(): void {
    this.cancionesService.getAll().subscribe(data => this.canciones.set(data));
    this.playlistsService.getAll().subscribe(data => this.playlists.set(data));
  }

  toggleMenu(cancionId: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.menuAbiertoId() === cancionId) {
      this.menuAbiertoId.set(null);
      return;
    }
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.menuPos.set({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    this.menuAbiertoId.set(cancionId);
  }

  cerrarMenu(): void {
    this.menuAbiertoId.set(null);
  }

  agregarAPlaylist(playlistId: number, cancionId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.playlistsService.addCancion(playlistId, cancionId).subscribe();
    this.cerrarMenu();
  }

  formatDuracion(segundos: number): string {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
