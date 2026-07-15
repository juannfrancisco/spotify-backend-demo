import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { APP_ROUTES_PATH_MENU } from '@shared/constants/app-routes.constants';
import { environment } from '@env';
import { SYSTEM_ENDPOINTS } from '@shared/constants/endpoints.constants';
import { Observable } from 'rxjs';
import { UserData } from '@core/models/user-data-response.model';
import { LoginDataResponse } from '@core/models/login-data-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'ZPR_TOKEN';
  private readonly CSRF_TOKEN_KEY = 'ZPR_CSRF_TOKEN';
  private readonly apiUrl = environment.apiEndpoint;
  private readonly jwtHelper = new JwtHelperService();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    const headers = new HttpHeaders();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Establece el token de autenticación en el sessionStorage.
   */
  public setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Obtiene el token de autenticación desde el sessionStorage.
   */
  public getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Elimina el token de autenticación del sessionStorage.
   */
  public removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Establece el token CSRF en el sessionStorage.
   */
  public setCsrfToken(csrfToken: string): void {
    sessionStorage.setItem(this.CSRF_TOKEN_KEY, csrfToken);
  }

  /**
   * Obtiene el token CSRF desde el sessionStorage.
   */
  public getCsrfToken(): string | null {
    return sessionStorage.getItem(this.CSRF_TOKEN_KEY);
  }

  /**
   * Elimina el token CSRF del sessionStorage.
   */
  public removeCsrfToken(): void {
    sessionStorage.removeItem(this.CSRF_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Inicia sesión con las credenciales proporcionadas.
   * El backend establecerá una cookie HttpOnly con el token de autenticación.
   */
  public login(credentials: { idToken: string; }): Observable<LoginDataResponse> {
    const authUrl = `${this.apiUrl}/${SYSTEM_ENDPOINTS.login}`;
    return this.http.post<LoginDataResponse>(authUrl, credentials, { 
      headers: this.getHeaders()
    });
  }

  public logout() {
    this.removeToken();
    this.removeCsrfToken();
    this.removeUserData();
    return this.router.navigate([`/${APP_ROUTES_PATH_MENU.login}`]);
  }

  public isAuthenticated2(): boolean {
    // Since we're using HttpOnly cookies, we only need to check if the user is authenticated
    // The actual token validation happens on the server side
    return this.isAuthenticated();
  }

  public setUserData(userData: UserData): void {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }

  public getUserData(): UserData | null {
    const str = sessionStorage.getItem('userData') ?? null;
    return str ? JSON.parse(str) : null;
  }

  public removeUserData(): void {
    sessionStorage.removeItem('userData');
  }
}
