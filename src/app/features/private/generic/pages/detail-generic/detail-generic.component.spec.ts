import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EMPTY, of, Subject, throwError } from 'rxjs';
import { DetailGenericComponent } from './detail-generic.component';
import { GenericService } from '@private/generic/services/generic.services';
import { DialogService } from '@core/services/dialog.service';
import { GenericModel } from '@private/generic/models/generic.model';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';

describe('DetailGenericComponent', () => {
  let component: DetailGenericComponent;
  let fixture: ComponentFixture<DetailGenericComponent>;
  let mockGenericService: jasmine.SpyObj<GenericService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let paramsSubject: Subject<any>;

  const mockRecord: GenericModel = {
    id: '1',
    name: 'Test Item',
    description: 'Test description',
    date: '01/01/2024',
    status: 'En progreso'
  };

  beforeEach(async () => {
    paramsSubject = new Subject();

    mockGenericService = jasmine.createSpyObj('GenericService', ['getRecordById']);
    mockDialogService = jasmine.createSpyObj('DialogService', ['setViewContainerRef', 'error', 'info']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], { events: EMPTY, url: '/' });
    mockRouter.createUrlTree.and.returnValue({} as any);
    mockRouter.serializeUrl.and.returnValue('');
    mockSvgIconRegistryService = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);

    await TestBed.configureTestingModule({
      imports: [DetailGenericComponent, AngularSvgIconModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: GenericService, useValue: mockGenericService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: Router, useValue: mockRouter },
        { provide: SvgIconRegistryService, useValue: mockSvgIconRegistryService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: paramsSubject.asObservable(),
            snapshot: { params: { id: '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailGenericComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockGenericService.getRecordById.and.returnValue(of(mockRecord));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set ViewContainerRef on DialogService', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();
      paramsSubject.next({ id: '1' });

      expect(mockDialogService.setViewContainerRef).toHaveBeenCalled();
    });

    it('should load record when ID is present in params', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();
      paramsSubject.next({ id: '1' });

      expect(mockGenericService.getRecordById).toHaveBeenCalledWith('1');
    });

    it('should set recordId from params', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();
      paramsSubject.next({ id: '42' });

      expect(component.recordId()).toBe('42');
    });

    it('should show error dialog when no ID in params', () => {
      fixture.detectChanges();
      paramsSubject.next({});

      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'No se proporcionó un ID válido',
        cancelText: 'Cerrar',
        showConfirmButton: false
      });
    });

    it('should not call getRecordById when no ID in params', () => {
      fixture.detectChanges();
      paramsSubject.next({});

      expect(mockGenericService.getRecordById).not.toHaveBeenCalled();
    });
  });

  describe('loadRecordDetail', () => {
    it('should set record when API returns valid data', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();
      paramsSubject.next({ id: '1' });

      expect(component.record()).toEqual(mockRecord);
    });

    it('should set isLoading to false after successful load', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();
      paramsSubject.next({ id: '1' });

      expect(component.isLoading()).toBe(false);
    });

    it('should show error dialog when record is null/undefined', () => {
      mockGenericService.getRecordById.and.returnValue(of(undefined));
      fixture.detectChanges();
      paramsSubject.next({ id: '1' });

      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'No se encontró el registro solicitado',
        cancelText: 'Cerrar',
        showConfirmButton: false
      });
    });

    it('should set isLoading to false when record is null', () => {
      mockGenericService.getRecordById.and.returnValue(of(undefined));
      fixture.detectChanges();
      paramsSubject.next({ id: '1' });

      expect(component.isLoading()).toBe(false);
    });

    it('should show error dialog on API error', () => {
      mockGenericService.getRecordById.and.returnValue(throwError(() => new Error('Network error')));
      fixture.detectChanges();
      paramsSubject.next({ id: '1' });

      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Error al cargar el detalle del registro',
        cancelText: 'Cerrar',
        showConfirmButton: false
      });
    });

    it('should set isLoading to false on API error', () => {
      mockGenericService.getRecordById.and.returnValue(throwError(() => new Error('Network error')));
      fixture.detectChanges();
      paramsSubject.next({ id: '1' });

      expect(component.isLoading()).toBe(false);
    });
  });

  describe('initial state', () => {
    it('should initialize record as null', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      expect(component.record()).toBeNull();
    });

    it('should initialize isLoading as true', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      expect(component.isLoading()).toBe(true);
    });

    it('should initialize recordId as empty string', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      expect(component.recordId()).toBe('');
    });
  });

  describe('onGoBack', () => {
    it('should navigate to the generic list route', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();

      component.onGoBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericList}`]
      );
    });
  });

  describe('onEdit', () => {
    it('should navigate to the edit route with the record ID', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();
      paramsSubject.next({ id: '5' });

      component.onEdit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericEdit}`, '5']
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete the destroy$ subject', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();

      const destroySpy = spyOn((component as any).destroy$, 'next').and.callThrough();
      const completeSpy = spyOn((component as any).destroy$, 'complete').and.callThrough();

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
