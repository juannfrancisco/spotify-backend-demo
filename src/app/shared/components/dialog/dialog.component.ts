import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() showFooter = true;
  @Input() showConfirmButton = true;
  @Input() showCancelButton = false;
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onClose() {
    if (this.isOpen) this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }


}