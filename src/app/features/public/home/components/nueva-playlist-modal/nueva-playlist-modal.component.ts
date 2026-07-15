import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nueva-playlist-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-playlist-modal.component.html',
  styleUrl: './nueva-playlist-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevaPlaylistModalComponent {
  @Output() confirmar = new EventEmitter<string>();
  @Output() cerrar = new EventEmitter<void>();

  nombre = signal('');

  onSubmit(): void {
    const valor = this.nombre().trim();
    if (!valor) return;
    this.confirmar.emit(valor);
    this.nombre.set('');
  }

  onCerrar(): void {
    this.nombre.set('');
    this.cerrar.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.onCerrar();
  }
}
