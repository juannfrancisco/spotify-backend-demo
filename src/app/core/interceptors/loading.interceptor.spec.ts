import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoadingInterceptor } from './loading.interceptor';
import { LoadingService } from '@core/services/loading.service';

describe('LoadingInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: loadingSpy },
        provideHttpClient(withInterceptors([LoadingInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show loading when request starts and hide when it completes successfully', () => {
    const testUrl = '/test';

    httpClient.get(testUrl).subscribe();

    expect(loadingService.show).toHaveBeenCalledTimes(1);

    const req = httpMock.expectOne(testUrl);
    req.flush({ data: 'test' });

    expect(loadingService.hide).toHaveBeenCalledTimes(1);
  });

  it('should show loading when request starts and hide when it fails', () => {
    const testUrl = '/test';

    httpClient.get(testUrl).subscribe({
      error: () => {}
    });

    expect(loadingService.show).toHaveBeenCalledTimes(1);

    const req = httpMock.expectOne(testUrl);
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(loadingService.hide).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple concurrent requests correctly', () => {
    const testUrl1 = '/test1';
    const testUrl2 = '/test2';

    // Start two requests
    httpClient.get(testUrl1).subscribe();
    httpClient.get(testUrl2).subscribe();

    expect(loadingService.show).toHaveBeenCalledTimes(2);

    // Complete first request
    const req1 = httpMock.expectOne(testUrl1);
    req1.flush({ data: 'test1' });

    expect(loadingService.hide).toHaveBeenCalledTimes(1);

    // Complete second request
    const req2 = httpMock.expectOne(testUrl2);
    req2.flush({ data: 'test2' });

    expect(loadingService.hide).toHaveBeenCalledTimes(2);
  });
});
