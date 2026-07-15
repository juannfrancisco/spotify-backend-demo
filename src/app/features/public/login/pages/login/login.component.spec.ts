import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginComponent } from './login.component';
import { GoogleAuthService } from '@public/login/services/google-auth.service';
import { AuthService } from '@core/auth/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { Subject, of, throwError } from 'rxjs';
import { LoginDataResponse } from '@core/models/login-data-response';
import { UserData } from '@core/models/user-data-response.model';

const mockUserData: UserData = {
  id: '1',
  name: 'Juan',
  email: 'juan@zentagroup.com',
  role: 'admin',
  status: true,
  username: 'juan',
  lastname: 'Doe',
  avatar: '',
};

const mockLoginResponse: LoginDataResponse = {
  code: 200,
  message: 'OK',
  token: 'mock-token',
  csrfToken: 'mock-csrf',
  data: mockUserData,
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockGoogleAuthService: jasmine.SpyObj<GoogleAuthService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockJwtHelper: jasmine.SpyObj<JwtHelperService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    const googleAuthSpy = jasmine.createSpyObj('GoogleAuthService', [
      'initAndRender',
      'reloadScript',
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'setToken',
      'setUserData',
      'setCsrfToken',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    const jwtSpy = jasmine.createSpyObj('JwtHelperService', ['decodeToken']);
    const dialogSpy = jasmine.createSpyObj('DialogService', [
      'setViewContainerRef',
      'error',
    ]);
    const svgSpy = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);

    googleAuthSpy.initAndRender.and.returnValue(Promise.resolve());
    googleAuthSpy.reloadScript.and.returnValue(Promise.resolve());
    authSpy.login.and.returnValue(of(mockLoginResponse));
    jwtSpy.decodeToken.and.returnValue({ picture: 'pic.png', family_name: 'Doe' });

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: GoogleAuthService, useValue: googleAuthSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: JwtHelperService, useValue: jwtSpy },
        { provide: DialogService, useValue: dialogSpy },
        { provide: SvgIconRegistryService, useValue: svgSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    mockGoogleAuthService = TestBed.inject(GoogleAuthService) as jasmine.SpyObj<GoogleAuthService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockJwtHelper = TestBed.inject(JwtHelperService) as jasmine.SpyObj<JwtHelperService>;
    mockDialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
  });

  // ─── Creación y ciclo de vida ──────────────────────────────────────────────

  describe('Creación y ciclo de vida', () => {
    it('debe crearse correctamente', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(component).toBeTruthy();
    }));

    it('debe registrar el ViewContainerRef en el DialogService durante ngAfterViewInit', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(mockDialogService.setViewContainerRef).toHaveBeenCalled();
    }));

    it('debe inicializar Google Sign-In en ngAfterViewInit', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(mockGoogleAuthService.initAndRender).toHaveBeenCalled();
    }));

    it('debe limpiar subscripciones en ngOnDestroy', () => {
      type WithDestroy = { destroy$: { next: () => void; complete: () => void } };
      const withDestroy = component as unknown as WithDestroy;
      spyOn(withDestroy.destroy$, 'next');
      spyOn(withDestroy.destroy$, 'complete');

      component.ngOnDestroy();

      expect(withDestroy.destroy$.next).toHaveBeenCalled();
      expect(withDestroy.destroy$.complete).toHaveBeenCalled();
    });
  });

  // ─── Estado inicial de señales ─────────────────────────────────────────────

  describe('Estado inicial de señales', () => {
    it('isLoading debe comenzar en false', () => {
      expect(component.isLoading()).toBeFalse();
    });

    it('isGoogleLoading debe comenzar en true hasta que initAndRender resuelva', fakeAsync(() => {
      // Antes de detectChanges/tick isGoogleLoading es true
      expect(component.isGoogleLoading()).toBeTrue();
      fixture.detectChanges();
      tick();
      expect(component.isGoogleLoading()).toBeFalse();
    }));

    it('showRetryButton debe comenzar en false', () => {
      expect(component.showRetryButton()).toBeFalse();
    });

    it('errorMessage debe comenzar en null', () => {
      expect(component.errorMessage()).toBeNull();
    });
  });

  // ─── initGoogleSignIn – flujo exitoso ──────────────────────────────────────

  describe('Inicialización Google Auth – éxito', () => {
    it('debe desactivar isGoogleLoading tras éxito', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(component.isGoogleLoading()).toBeFalse();
    }));

    it('no debe mostrar el botón de reintento tras éxito', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(component.showRetryButton()).toBeFalse();
    }));
  });

  // ─── initGoogleSignIn – flujo con error ───────────────────────────────────

  describe('Inicialización Google Auth – error', () => {
    beforeEach(() => {
      mockGoogleAuthService.initAndRender.and.returnValue(Promise.reject('SDK error'));
    });

    it('debe mostrar el botón de reintento si initAndRender falla', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(component.showRetryButton()).toBeTrue();
    }));

    it('debe establecer errorMessage si initAndRender falla', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(component.errorMessage()).toContain('No se pudo cargar');
    }));

    it('debe desactivar isGoogleLoading aunque falle', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(component.isGoogleLoading()).toBeFalse();
    }));
  });

  // ─── retryGoogleSignIn ─────────────────────────────────────────────────────

  describe('retryGoogleSignIn', () => {
    it('debe llamar a reloadScript e initAndRender', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      component.retryGoogleSignIn();
      tick();
      expect(mockGoogleAuthService.reloadScript).toHaveBeenCalled();
      expect(mockGoogleAuthService.initAndRender).toHaveBeenCalledTimes(2);
    }));

    it('debe mostrar reintento y errorMessage si retryGoogleSignIn falla', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      mockGoogleAuthService.reloadScript.and.returnValue(Promise.reject('net error'));
      component.retryGoogleSignIn();
      tick();
      expect(component.showRetryButton()).toBeTrue();
      expect(component.errorMessage()).toContain('No se pudo cargar el servicio de Google');
    }));
  });

  // ─── handleCredentialResponse ──────────────────────────────────────────────

  describe('handleCredentialResponse', () => {
    it('debe llamar a loginZenta cuando hay credencial', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      spyOn(component, 'loginZenta');
      component.handleCredentialResponse({ credential: 'token-abc' });
      expect(component.loginZenta).toHaveBeenCalledWith('token-abc');
    }));

    it('no debe llamar a loginZenta si la credencial es null', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      spyOn(component, 'loginZenta');
      component.handleCredentialResponse({ credential: null! });
      expect(component.loginZenta).not.toHaveBeenCalled();
    }));
  });

  // ─── loginZenta – flujo exitoso ────────────────────────────────────────────

  describe('loginZenta – éxito', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('debe llamar a authService.login con el idToken correcto', fakeAsync(() => {
      component.loginZenta('my-credential');
      tick();
      expect(mockAuthService.login).toHaveBeenCalledWith({ idToken: 'my-credential' });
    }));

    it('debe llamar a authService.setToken con el token de la respuesta', fakeAsync(() => {
      component.loginZenta('my-credential');
      tick();
      expect(mockAuthService.setToken).toHaveBeenCalledWith('mock-token');
    }));

    it('debe llamar a authService.setCsrfToken cuando viene csrfToken', fakeAsync(() => {
      component.loginZenta('my-credential');
      tick();
      expect(mockAuthService.setCsrfToken).toHaveBeenCalledWith('mock-csrf');
    }));

    it('debe llamar a authService.setUserData con los datos del usuario', fakeAsync(() => {
      component.loginZenta('my-credential');
      tick();
      expect(mockAuthService.setUserData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: 'Juan',
          email: 'juan@zentagroup.com',
          avatar: 'pic.png',
          lastname: 'Doe',
        })
      );
    }));

    it('debe navegar a "/" por defecto cuando no hay returnUrl', fakeAsync(() => {
      component.loginZenta('my-credential');
      tick();
      expect(mockRouter.navigateByUrl).toHaveBeenCalled();
    }));

    it('debe navegar al returnUrl si está presente en queryParams', fakeAsync(() => {
      type WithQueryParams = { snapshot: { queryParams: Record<string, string> } };
      (TestBed.inject(ActivatedRoute) as unknown as WithQueryParams).snapshot.queryParams = {
        returnUrl: '/dashboard',
      };
      component.loginZenta('my-credential');
      tick();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    }));

    it('debe desactivar isLoading al finalizar con éxito', fakeAsync(() => {
      component.loginZenta('my-credential');
      tick();
      expect(component.isLoading()).toBeFalse();
    }));
  });

  // ─── loginZenta – flujo con error ─────────────────────────────────────────

  describe('loginZenta – error de API', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
      mockAuthService.login.and.returnValue(
        throwError(() => ({ error: { message: 'Unauthorized' } }))
      );
    }));

    it('debe establecer errorMessage cuando falla el login', fakeAsync(() => {
      component.loginZenta('bad-credential');
      tick();
      expect(component.errorMessage()).toContain('No se pudo iniciar sesión');
      expect(component.errorMessage()).toContain('Unauthorized');
    }));

    it('debe desactivar isLoading tras un error de API', fakeAsync(() => {
      component.loginZenta('bad-credential');
      tick();
      expect(component.isLoading()).toBeFalse();
    }));

    it('debe incluir "Error desconocido" cuando el error no tiene mensaje', fakeAsync(() => {
      mockAuthService.login.and.returnValue(throwError(() => ({})));
      component.loginZenta('bad-credential');
      tick();
      expect(component.errorMessage()).toContain('Error desconocido');
    }));
  });

  // ─── loginZenta – casos borde ──────────────────────────────────────────────

  describe('loginZenta – casos borde', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('no debe llamar a setUserData cuando la respuesta es null', fakeAsync(() => {
      mockAuthService.login.and.returnValue(of(null as unknown as LoginDataResponse));
      component.loginZenta('cred');
      tick();
      expect(mockAuthService.setUserData).not.toHaveBeenCalled();
    }));

    it('no debe llamar a setCsrfToken cuando csrfToken está vacío', fakeAsync(() => {
      mockAuthService.login.and.returnValue(
        of({ ...mockLoginResponse, csrfToken: '' })
      );
      component.loginZenta('cred');
      tick();
      expect(mockAuthService.setCsrfToken).not.toHaveBeenCalled();
    }));

    it('debe activar isLoading al comenzar el proceso de login', fakeAsync(() => {
      // Use a Subject so the Observable doesn't emit synchronously
      const subject = new Subject<LoginDataResponse>();
      mockAuthService.login.and.returnValue(subject.asObservable());
      component.loginZenta('cred');
      expect(component.isLoading()).toBeTrue();
      subject.next(mockLoginResponse);
      subject.complete();
      tick();
    }));

    it('debe limpiar errorMessage al iniciar loginZenta', fakeAsync(() => {
      component.errorMessage.set('Error previo');
      component.loginZenta('cred');
      expect(component.errorMessage()).toBeNull();
    }));
  });
});
