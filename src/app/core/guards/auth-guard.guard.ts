import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { APP_ROUTES_PATH_MENU } from '@shared/constants/app-routes.constants';
import { AuthService } from '@core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated2()) {
      this.router.navigate([`/${APP_ROUTES_PATH_MENU.login}`]);
      return false;
    }
    return true;
  }
}
