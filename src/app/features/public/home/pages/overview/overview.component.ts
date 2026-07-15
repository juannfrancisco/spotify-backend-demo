import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListaArtistasComponent } from '../../components/lista-artistas/lista-artistas.component';
import { ListaCancionesComponent } from '../../components/lista-canciones/lista-canciones.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [ListaArtistasComponent, ListaCancionesComponent],
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {}
