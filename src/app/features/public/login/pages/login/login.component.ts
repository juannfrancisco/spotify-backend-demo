import { ChangeDetectionStrategy, Component, OnDestroy, ViewContainerRef, AfterViewInit, inject, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '@core/auth/auth.service';
import { GoogleAuthService } from '@public/login/services/google-auth.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DialogService } from '@core/services/dialog.service';
import { LoginDataResponse } from '@core/models/login-data-response';
import { environment } from '@env';

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

interface GoogleJwtPayload {
  picture?: string;
  family_name?: string;
  given_name?: string;
  email?: string;
  sub?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AngularSvgIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy, AfterViewInit {
  private readonly destroy$ = new Subject<void>();
  private readonly googleAuthService: GoogleAuthService = inject(GoogleAuthService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly jwtHelper: JwtHelperService = inject(JwtHelperService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  isLoading = signal<boolean>(false);
  isGoogleLoading = signal<boolean>(true);
  showRetryButton = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  version: string = environment.appVersion || '1.0.0';
  environmentName: string = environment.nodeEnv || 'production';
  constructor(
  ) {}

  ngAfterViewInit(): void {
    this.dialogService.setViewContainerRef(this.viewContainerRef);
    this.initGoogleSignIn();
  }

  /**
   * Initializes Google Sign-In with polling/retry for SDK availability.
   * Shows a skeleton loader while waiting and a retry button on failure.
   */
  private async initGoogleSignIn(): Promise<void> {
    this.isGoogleLoading.set(true);
    this.showRetryButton.set(false);
    this.errorMessage.set(null);

    try {
      await this.googleAuthService.initAndRender(
        this.handleCredentialResponse.bind(this),
        'signInDiv'
      );
      this.isGoogleLoading.set(false);
    } catch (error) {
      console.error('Error during Google Auth initialization:', error);
      this.isGoogleLoading.set(false);
      this.showRetryButton.set(true);
      this.errorMessage.set(
        'No se pudo cargar el botón de inicio de sesión con Google. Intenta nuevamente.'
      );
    }
  }

  /**
   * Retry handler: reloads the GSI script dynamically and re-initializes.
   * Critical for PWAs where page reload may not be possible.
   */
  async retryGoogleSignIn(): Promise<void> {
    this.isGoogleLoading.set(true);
    this.showRetryButton.set(false);
    this.errorMessage.set(null);

    try {
      await this.googleAuthService.reloadScript();
      await this.googleAuthService.initAndRender(
        this.handleCredentialResponse.bind(this),
        'signInDiv'
      );
      this.isGoogleLoading.set(false);
    } catch (error) {
      console.error('Error retrying Google Auth:', error);
      this.isGoogleLoading.set(false);
      this.showRetryButton.set(true);
      this.errorMessage.set(
        'No se pudo cargar el servicio de Google. Verifica tu conexión a internet e intenta nuevamente.'
      );
    }
  }

  handleCredentialResponse(response: GoogleCredentialResponse) {
    if (response?.credential != null) {
      this.loginZenta(response.credential);
    }
  }

  loginZenta(credential: string) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.authService.login({ idToken: credential })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (res: LoginDataResponse) => {
          try {
            if (!res) return;

            const credentialObj: GoogleJwtPayload | null = this.jwtHelper.decodeToken<GoogleJwtPayload>(credential);
            const userData = {
              name: res.data.name,
              email: res.data.email,
              avatar: credentialObj?.picture ?? '',
              id: res.data.id,
              lastname: credentialObj?.family_name ?? '',
              role: res.data.role,
              status: res.data.status,
              username: res.data.username,
            };
            this.authService.setUserData(userData);
            this.authService.setToken(res.token);
            if (res.csrfToken) {
              this.authService.setCsrfToken(res.csrfToken);
            }
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || ['/'];
            this._router.navigateByUrl(returnUrl);
          } catch (error) {
            console.error('Post-login processing error:', error);
            this.errorMessage.set('No se pudo completar el proceso de inicio de sesión. Intenta nuevamente.');
          } finally {
            this.isLoading.set(false);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage.set(
            'No se pudo iniciar sesión con Google. Intenta nuevamente. \n' +
            'error: ' + (error?.error?.message || 'Error desconocido')
          );
          this.isLoading.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
