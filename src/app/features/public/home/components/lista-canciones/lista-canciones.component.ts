import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancionesService } from '@core/services/canciones.service';
import { Cancion } from '@core/models/cancion.model';

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

  canciones = signal<Cancion[]>([]);

  ngOnInit(): void {
    this.cancionesService.getAll().subscribe(data => this.canciones.set(data));
  }

  formatDuracion(segundos: number): string {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
