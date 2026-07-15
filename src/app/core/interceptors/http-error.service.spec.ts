import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from './http-error.service';
import { AuthService } from '@core/auth/auth.service';
import { ErrorHandlerService } from '@core/services/error-handler.service';

describe('HttpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let errorHandlerService: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const errorSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ErrorHandlerService, useValue: errorSpy },
        provideHttpClient(withInterceptors([HttpErrorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    errorHandlerService = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle HTTP errors', (done) => {
    const testUrl = '/test';

    httpClient.get(testUrl).subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.code).toBe(500);
        expect(error.status).toBe('error');
        expect(errorHandlerService.handleError).toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle 401 unauthorized errors', (done) => {
    const testUrl = '/test';

    httpClient.get(testUrl).subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.code).toBe(401);
        expect(error.status).toBe('error');
        expect(authService.logout).toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should pass through successful requests', () => {
    const testUrl = '/test';
    const testData = { message: 'success' };

    httpClient.get(testUrl).subscribe(response => {
      expect(response).toEqual(testData);
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(testData);
  });

  it('should standardize error from error body with statusCode and body', (done) => {
    const testUrl = '/test';

    httpClient.get(testUrl).subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.code).toBe(400);
        expect(error.message).toBe('Validation error');
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush({ statusCode: 400, body: 'Validation error' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should not call logout when error.error is null (network error)', (done) => {
    const testUrl = '/test';

    httpClient.get(testUrl).subscribe({
      next: () => fail('Should have failed'),
      error: () => {
        expect(authService.logout).not.toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('should not call logout when error.error.statusCode is 0', (done) => {
    const testUrl = '/test';

    httpClient.get(testUrl).subscribe({
      next: () => fail('Should have failed'),
      error: () => {
        expect(authService.logout).not.toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush({ statusCode: 0, body: 'Network error' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should skip error handling when skip-error-handling header is true', (done) => {
    const testUrl = '/test';

    httpClient.get(testUrl, { headers: { 'skip-error-handling': 'true' } }).subscribe({
      next: () => fail('Should have failed'),
      error: () => {
        expect(errorHandlerService.handleError).not.toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should standardize response format when needed', () => {
    const testUrl = '/test';
    const responseBody = {
      statusCode: 400,
      body: 'Bad Request Error'
    };

    httpClient.get(testUrl).subscribe(response => {
      expect(response).toEqual({
        code: 400,
        status: 'error',
        message: 'Bad Request Error'
      });
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(responseBody);
  });
});