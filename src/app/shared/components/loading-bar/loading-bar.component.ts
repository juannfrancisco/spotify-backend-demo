import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-bar.component.html',
  styleUrl: './loading-bar.component.css'
})
export class LoadingBarComponent {
  /**
   * Color de la barra de carga
   * @default 'primary'
   */
  color = input<'primary' | 'secondary' | 'success' | 'warning' | 'danger'>('primary');

  /**
   * Altura de la barra en píxeles
   * @default 4
   */
  height = input<number>(4);

  /**
   * Posición de la barra
   * @default 'top'
   */
  position = input<'top' | 'bottom'>('top');
}
