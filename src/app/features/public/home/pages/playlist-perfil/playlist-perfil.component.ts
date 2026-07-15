import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlaylistsService } from '@core/services/playlists.service';
import { Playlist } from '@core/models/playlist.model';

@Component({
  selector: 'app-playlist-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist-perfil.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistPerfilComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly playlistsService = inject(PlaylistsService);

  playlist = signal<Playlist | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.playlist.set(null);
      this.playlistsService.getById(id).subscribe(data => this.playlist.set(data));
    });
  }

  formatDuracion(segundos: number): string {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  totalDuracion(): number {
    return this.playlist()?.canciones.reduce((acc, c) => acc + c.duracion, 0) ?? 0;
  }
}
