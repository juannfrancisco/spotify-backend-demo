import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '@shared/components/dialog/dialog.component';

@Component({
  selector: 'app-dialog-delete-confirmation',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './dialog-delete-confirmation.component.html',
  styleUrls: ['./dialog-delete-confirmation.component.css']
})
export class DialogDeleteConfirmationComponent {
  @Input() isOpen = false;
  @Input() itemName = '';
  @Input() title = 'Confirmar Eliminación';
  @Input() message = '¿Estás seguro de que deseas eliminar este elemento?';
  @Input() warningMessage = 'Esta acción no se puede deshacer.';
  @Input() cancelText = 'Cancelar';
  @Input() confirmText = 'Eliminar';
  
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
