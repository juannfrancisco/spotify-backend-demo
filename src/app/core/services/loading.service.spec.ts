import { TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;
  let spinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy }
      ]
    });
    
    service = TestBed.inject(LoadingService);
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show spinner on first call to show()', () => {
    service.show();
    
    expect(spinnerService.show).toHaveBeenCalledTimes(1);
    expect(service.isLoading()).toBe(true);
  });

  it('should not show spinner multiple times when called multiple times', () => {
    service.show();
    service.show();
    service.show();
    
    expect(spinnerService.show).toHaveBeenCalledTimes(1);
    expect(service.isLoading()).toBe(true);
  });

  it('should hide spinner only when all loading operations are complete', () => {
    service.show();
    service.show();
    service.show();
    
    service.hide();
    expect(spinnerService.hide).not.toHaveBeenCalled();
    expect(service.isLoading()).toBe(true);
    
    service.hide();
    expect(spinnerService.hide).not.toHaveBeenCalled();
    expect(service.isLoading()).toBe(true);
    
    service.hide();
    expect(spinnerService.hide).toHaveBeenCalledTimes(1);
    expect(service.isLoading()).toBe(false);
  });

  it('should return correct loading state', () => {
    expect(service.isLoading()).toBe(false);
    
    service.show();
    expect(service.isLoading()).toBe(true);
    
    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should handle hide() calls without previous show() calls gracefully', () => {
    service.hide();
    
    expect(spinnerService.hide).not.toHaveBeenCalled();
    expect(service.isLoading()).toBe(false);
  });
});
