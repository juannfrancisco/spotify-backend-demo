import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '@core/auth/auth.service';
import { environment } from '@env';
import { SYSTEM_ENDPOINTS } from '@shared/constants/endpoints.constants';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken', 'getCsrfToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        provideHttpClient(withInterceptors([AuthInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists and not login request', () => {
    const token = 'test-token';
    const testUrl = `${environment.apiEndpoint}/test`;
    
    authService.getToken.and.returnValue(token);
    authService.getCsrfToken.and.returnValue(null);

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    
    req.flush({});
  });

  it('should add both Authorization and CSRF headers when both tokens exist', () => {
    const token = 'test-token';
    const csrfToken = 'test-csrf-token';
    const testUrl = `${environment.apiEndpoint}/test`;
    
    authService.getToken.and.returnValue(token);
    authService.getCsrfToken.and.returnValue(csrfToken);

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.headers.has('x-csrf-token')).toBe(true);
    expect(req.request.headers.get('x-csrf-token')).toBe(csrfToken);
    
    req.flush({});
  });

  it('should not add Authorization header for login requests', () => {
    const token = 'test-token';
    const loginUrl = `${environment.apiEndpoint}/${SYSTEM_ENDPOINTS.login}`;
    
    authService.getToken.and.returnValue(token);
    authService.getCsrfToken.and.returnValue(null);

    httpClient.post(loginUrl, {}).subscribe();

    const req = httpMock.expectOne(loginUrl);
    expect(req.request.headers.has('Authorization')).toBe(false);
    
    req.flush({});
  });

  it('should not add headers when no token exists', () => {
    const testUrl = `${environment.apiEndpoint}/test`;
    
    authService.getToken.and.returnValue(null);
    authService.getCsrfToken.and.returnValue(null);

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(req.request.headers.has('x-csrf-token')).toBe(false);
    
    req.flush({});
  });

  it('should not modify requests to external URLs', () => {
    const externalUrl = 'https://external-api.com/test';
    const token = 'test-token';
    
    authService.getToken.and.returnValue(token);
    authService.getCsrfToken.and.returnValue('csrf-token');

    httpClient.get(externalUrl).subscribe();

    const req = httpMock.expectOne(externalUrl);
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(req.request.headers.has('x-csrf-token')).toBe(false);
    
    req.flush({});
  });
});
