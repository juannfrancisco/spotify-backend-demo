import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArtistasService } from '@core/services/artistas.service';
import { CancionesService } from '@core/services/canciones.service';
import { Artista } from '@core/models/artista.model';
import { Cancion } from '@core/models/cancion.model';

@Component({
  selector: 'app-artista-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artista-perfil.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistaPerfilComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly artistasService = inject(ArtistasService);
  private readonly cancionesService = inject(CancionesService);

  artista = signal<Artista | null>(null);
  canciones = signal<Cancion[]>([]);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.artista.set(null);
      this.canciones.set([]);
      this.artistasService.getById(id).subscribe(data => this.artista.set(data));
      this.cancionesService.getAll().subscribe(data =>
        this.canciones.set(data.filter(c => c.artista.id === id))
      );
    });
  }

  formatDuracion(segundos: number): string {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  formatOyentes(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toString();
  }
}
