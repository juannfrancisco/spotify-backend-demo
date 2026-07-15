import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth-guard.guard';
import { AuthService } from '@core/auth/auth.service';
import { APP_ROUTES_PATH_MENU } from '@shared/constants/app-routes.constants';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated2']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated', () => {
    authService.isAuthenticated2.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBe(true);
    expect(authService.isAuthenticated2).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to login when user is not authenticated', () => {
    authService.isAuthenticated2.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(authService.isAuthenticated2).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([`/${APP_ROUTES_PATH_MENU.login}`]);
  });
});
