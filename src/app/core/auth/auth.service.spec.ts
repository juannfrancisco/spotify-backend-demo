import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginDataResponse } from '@core/models/login-data-response';
import { UserData } from '@core/models/user-data-response.model';
import { environment } from '@env';
import { SYSTEM_ENDPOINTS } from '@shared/constants/endpoints.constants';
import { APP_ROUTES_PATH_MENU } from '@shared/constants/app-routes.constants';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let mockSessionStorage: { [key: string]: string };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    // Mock sessionStorage
    mockSessionStorage = {};
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => mockSessionStorage[key] || null);
    spyOn(sessionStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockSessionStorage[key] = value;
    });
    spyOn(sessionStorage, 'removeItem').and.callFake((key: string) => {
      delete mockSessionStorage[key];
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Token Management', () => {
    it('should set and get token', () => {
      const token = 'test-token';
      service.setToken(token);
      
      expect(sessionStorage.setItem).toHaveBeenCalledWith('ZPR_TOKEN', token);
      expect(service.getToken()).toBe(token);
    });

    it('should remove token', () => {
      service.removeToken();
      
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('ZPR_TOKEN');
    });

    it('should return null when no token exists', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('CSRF Token Management', () => {
    it('should set and get CSRF token', () => {
      const csrfToken = 'test-csrf-token';
      service.setCsrfToken(csrfToken);
      
      expect(sessionStorage.setItem).toHaveBeenCalledWith('ZPR_CSRF_TOKEN', csrfToken);
      expect(service.getCsrfToken()).toBe(csrfToken);
    });

    it('should remove CSRF token', () => {
      service.removeCsrfToken();
      
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('ZPR_CSRF_TOKEN');
    });
  });

  describe('User Data Management', () => {
    it('should set and get user data', () => {
      const userData: UserData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        lastname: 'User',
        role: 'admin',
        status: true,
        username: 'testuser',
        avatar: 'avatar.jpg'
      };
      
      service.setUserData(userData);
      
      expect(sessionStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(userData));
      expect(service.getUserData()).toEqual(userData);
    });

    it('should return null when no user data exists', () => {
      expect(service.getUserData()).toBeNull();
    });

    it('should remove user data', () => {
      service.removeUserData();
      
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('userData');
    });
  });

  describe('Authentication', () => {
    it('should return true when token exists', () => {
      mockSessionStorage['ZPR_TOKEN'] = 'test-token';
      
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return same result for isAuthenticated2', () => {
      mockSessionStorage['ZPR_TOKEN'] = 'test-token';
      
      expect(service.isAuthenticated2()).toBe(true);
      expect(service.isAuthenticated2()).toBe(service.isAuthenticated());
    });
  });

  describe('Login', () => {
    it('should make login request', () => {
      const credentials = { idToken: 'google-token' };
      const expectedResponse: LoginDataResponse = {
        code: 200,
        message: 'Success',
        token: 'jwt-token',
        csrfToken: 'csrf-token',
        data: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          lastname: 'User',
          role: 'admin',
          status: true,
          username: 'testuser',
          avatar: 'avatar.jpg'
        }
      };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne(`${environment.apiEndpoint}/${SYSTEM_ENDPOINTS.login}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      
      req.flush(expectedResponse);
    });
  });

  describe('Logout', () => {
    it('should clear all tokens and user data and navigate to login', () => {
      // Set up some data first
      service.setToken('test-token');
      service.setCsrfToken('test-csrf');
      service.setUserData({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        lastname: 'User',
        role: 'admin',
        status: true,
        username: 'testuser',
        avatar: 'avatar.jpg'
      });

      service.logout();

      expect(sessionStorage.removeItem).toHaveBeenCalledWith('ZPR_TOKEN');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('ZPR_CSRF_TOKEN');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('userData');
      expect(router.navigate).toHaveBeenCalledWith([`/${APP_ROUTES_PATH_MENU.login}`]);
    });
  });
});
