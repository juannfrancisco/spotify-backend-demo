import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lateral-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lateral-modal.component.html',
  styleUrl: './lateral-modal.component.css'
})
export class LateralModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() width: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() closeOnBackdropClick = true;

  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isOpen) this.close.emit();
  }

  onBackdropClick() {
    if (this.closeOnBackdropClick) this.close.emit();
  }

  get panelWidthClass(): string {
    const map: Record<string, string> = {
      sm: 'w-full max-w-sm',
      md: 'w-full max-w-md',
      lg: 'w-full max-w-lg',
      xl: 'w-full max-w-xl'
    };
    return map[this.width];
  }
}
