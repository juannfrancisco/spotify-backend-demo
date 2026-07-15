import { Component, Input, OnInit } from '@angular/core';
import { ENUM_LABELS } from '@shared/constants/enum-labels.constants';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [],
  template: `
    <span [class]="classes">
      {{ textValue }}
    </span>
  `,
})
export class StatusBadgeComponent implements OnInit {
  @Input() status!: string;
  classes: string;
  textValue: string = '';

  fixedClasses: string = 'h-[22] rounded-[5px] text-xs px-2 py-1 border';

  badgeClasses: Record<string, string> = {
    'blue': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100  border-blue-300 dark:border-blue-800',
    'yellow': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100  border-yellow-300 dark:border-yellow-800',
    'green': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100  border-green-300 dark:border-green-800',
    'red': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100  border-red-300 dark:border-red-800',
    'cyan': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100  border-cyan-300 dark:border-cyan-800',
    'gray': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100  border-gray-300 dark:border-gray-800',
  };

  badgeColors: Record<string, string> = {
    'Ingresada': 'blue',
    'En Validación': 'yellow',
    'En progreso': 'yellow',
    'En proceso de pago': 'green',
    'Completado': 'green',
    'Pendiente': 'gray',
    'Cancelado' : 'red',
    'Pagada': 'red',
    'Rechazada': 'red',
    'Procesada': 'red',
  };


  constructor() {
    this.classes = 'flex justify-center items-center w-[140] h-[22] rounded-[5px] bg-blue-700 text-xs font-medium text-white';
  }

  ngOnInit(): void {
    const color = this.badgeColors[this.status];
    this.classes = this.fixedClasses + ' ' + this.badgeClasses[color];
    this.textValue = ENUM_LABELS[this.status] || this.status;
  }
}