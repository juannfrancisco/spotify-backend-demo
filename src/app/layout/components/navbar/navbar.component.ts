import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuService } from '../../services/menu.service';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobile.component';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [AngularSvgIconModule, ProfileMenuComponent, NavbarMobileComponent],
})
export class NavbarComponent implements OnInit {
  constructor(private readonly menuService: MenuService) {}

  ngOnInit(): void {
    // Initialize any additional logic here if needed
  }

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }
}
