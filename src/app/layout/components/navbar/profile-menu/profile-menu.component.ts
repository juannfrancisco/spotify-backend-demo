import { animate, state, style, transition, trigger } from '@angular/animations';

import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '@core/services/theme.service';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { AuthService } from '@core/auth/auth.service';
import { UserData } from '@core/models/user-data-response.model';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css'],
  imports: [ClickOutsideDirective, AngularSvgIconModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public isOpen = false;
  profile: UserData = {} as UserData;
  public profileMenu = [
     {
        title: this.themeService.isDark ? 'Modo Claro' : 'Modo Oscuro',
        icon: this.themeService.isDark ? 'icons/heroicons/outline/sun.svg' : 'icons/heroicons/outline/moon.svg',
        action: () => this.toggleTheme(),
    },
    {
      title: 'Cerrar Sesión',
      icon: 'icons/heroicons/outline/logout.svg',
      action: () => this.authService.logout(),
    },
  ];


  constructor(public themeService: ThemeService, private readonly authService: AuthService) {}

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    if (userData) {
      this.profile = userData;
    }
  }

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  public toggleTheme(): void {
    const currentTheme = this.themeService.theme();
    this.themeService.theme.set({
      ...currentTheme,
      mode: currentTheme.mode === 'dark' ? 'light' : 'dark'
    });
    // Actualizar el menú después del cambio de tema
    this.updateProfileMenu();
  
  }

  private updateProfileMenu(): void {
    this.profileMenu = [
      {
        title: this.themeService.isDark ? 'Modo Claro' : 'Modo Oscuro',
        icon: this.themeService.isDark ? 'icons/heroicons/outline/sun.svg' : 'icons/heroicons/outline/moon.svg',
        action: () => this.toggleTheme(),
      },
      {
        title: 'Cerrar Sesión',
        icon: 'icons/heroicons/outline/logout.svg',
        action: () => this.authService.logout(),
      },
    ];
  }
}
