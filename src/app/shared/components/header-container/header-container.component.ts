import { Component, Input } from '@angular/core';
import { MenuFloatingComponent } from '../menu-floating/menu-floating.component';
import { MenuFloatingItem } from '../menu-floating/model/menu-floating-item.model';

@Component({
  selector: 'app-header-container',
  templateUrl: './header-container.component.html',
  standalone: true,
  imports: [ MenuFloatingComponent
  ],
})
export class HeaderContainerComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() items: MenuFloatingItem[] = [];
}