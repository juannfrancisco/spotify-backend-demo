import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistasService } from '@core/services/artistas.service';
import { Artista } from '@core/models/artista.model';

@Component({
  selector: 'app-lista-artistas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-artistas.component.html',
  styleUrl: './lista-artistas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaArtistasComponent implements OnInit {
  private readonly artistasService = inject(ArtistasService);

  artistas = signal<Artista[]>([]);

  ngOnInit(): void {
    this.artistasService.getAll().subscribe(data => this.artistas.set(data));
  }
}
