
import { Component, Input, signal } from '@angular/core';
import { MenuFloatingItem } from './model/menu-floating-item.model';
import { AngularSvgIconModule } from "angular-svg-icon";

@Component({
    standalone: true,
    selector: 'app-menu-floating',
    templateUrl: './menu-floating.component.html',
    imports: [AngularSvgIconModule],
    //styleUrls: ['./menu-floating.component.css'],
})
export class MenuFloatingComponent {

    @Input() items: MenuFloatingItem[] = [];
    isMenuOpen = signal(false);

    constructor() { }


    toggleMenu() {
        this.isMenuOpen.set(!this.isMenuOpen());
    }

}