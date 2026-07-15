import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreateGenericComponent } from './create-generic.component';
import { GenericService } from '@private/generic/services/generic.services';
import { DialogService } from '@core/services/dialog.service';
import { GenericModel } from '@private/generic/models/generic.model';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';

describe('CreateGenericComponent', () => {
  let component: CreateGenericComponent;
  let fixture: ComponentFixture<CreateGenericComponent>;
  let mockGenericService: jasmine.SpyObj<GenericService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let router: Router;

  const mockRecord: GenericModel = {
    id: '1',
    name: 'Test Record',
    description: 'Test Description',
    date: '01/01/2024',
    status: 'En progreso'
  };

  const validFormValues = {
    name: 'Test Name',
    description: 'Test Description',
    date: '2024-01-01',
    status: 'En progreso'
  };

  beforeEach(async () => {
    mockGenericService = jasmine.createSpyObj('GenericService', [
      'postRecord',
      'mapModelToCreateDto'
    ]);
    mockDialogService = jasmine.createSpyObj('DialogService', [
      'setViewContainerRef',
      'error',
      'info'
    ]);
    mockSvgIconRegistryService = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);

    await TestBed.configureTestingModule({
      imports: [CreateGenericComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: GenericService, useValue: mockGenericService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: SvgIconRegistryService, useValue: mockSvgIconRegistryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGenericComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should set ViewContainerRef on DialogService in constructor', () => {
      expect(mockDialogService.setViewContainerRef).toHaveBeenCalled();
    });

    it('should initialize form with empty values', () => {
      expect(component.form.get('name')?.value).toBe('');
      expect(component.form.get('description')?.value).toBe('');
      expect(component.form.get('date')?.value).toBe('');
      expect(component.form.get('status')?.value).toBe('');
    });

    it('should initialize all form controls as required', () => {
      expect(component.form.get('name')?.hasError('required')).toBe(true);
      expect(component.form.get('description')?.hasError('required')).toBe(true);
      expect(component.form.get('date')?.hasError('required')).toBe(true);
      expect(component.form.get('status')?.hasError('required')).toBe(true);
    });

    it('should initialize form as invalid', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should initialize showDetailDialog as false', () => {
      expect(component.showDetailDialog()).toBe(false);
    });

    it('should initialize recordToAdd as null', () => {
      expect(component.recordToAdd()).toBeNull();
    });

    it('should have 4 predefined statuses', () => {
      const expectedStatuses = [
        { id: 1, name: 'En progreso' },
        { id: 2, name: 'Completado' },
        { id: 3, name: 'Pendiente' },
        { id: 4, name: 'Cancelado' }
      ];
      expect(component.statuses()).toEqual(expectedStatuses);
    });
  });

  describe('onSubmit', () => {
    it('should mark all controls as touched when form is invalid', () => {
      component.onSubmit();

      expect(component.form.get('name')?.touched).toBe(true);
      expect(component.form.get('description')?.touched).toBe(true);
      expect(component.form.get('date')?.touched).toBe(true);
      expect(component.form.get('status')?.touched).toBe(true);
    });

    it('should show error dialog when form is invalid', () => {
      component.onSubmit();

      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Por favor, complete todos los campos requeridos',
        cancelText: 'cerrar',
        showConfirmButton: false
      });
    });

    it('should not show confirmation dialog when form is invalid', () => {
      component.onSubmit();

      expect(component.showDetailDialog()).toBe(false);
    });

    it('should show error dialog when only some fields are filled', () => {
      component.form.patchValue({ name: 'Only Name', description: '', date: '', status: '' });

      component.onSubmit();

      expect(mockDialogService.error).toHaveBeenCalled();
      expect(component.showDetailDialog()).toBe(false);
    });

    it('should set showDetailDialog to true when form is valid', () => {
      component.form.patchValue(validFormValues);

      component.onSubmit();

      expect(component.showDetailDialog()).toBe(true);
    });

    it('should set recordToAdd with formatted date when form is valid', () => {
      component.form.patchValue(validFormValues);

      component.onSubmit();

      expect(component.recordToAdd()).toEqual(jasmine.objectContaining({
        name: 'Test Name',
        description: 'Test Description',
        date: '01/01/2024',
        status: 'En progreso'
      }));
    });

    it('should format date from YYYY-MM-DD to DD/MM/YYYY', () => {
      component.form.patchValue({ ...validFormValues, date: '2024-12-25' });

      component.onSubmit();

      expect(component.recordToAdd()?.date).toBe('25/12/2024');
    });

    it('should not call error dialog when form is valid', () => {
      component.form.patchValue(validFormValues);

      component.onSubmit();

      expect(mockDialogService.error).not.toHaveBeenCalled();
    });
  });

  describe('onConfirmDialog', () => {
    const createDto = { name: 'Test Record', description: 'Test Description', status: 'En progreso' };

    beforeEach(() => {
      component.recordToAdd.set(mockRecord);
      mockGenericService.mapModelToCreateDto.and.returnValue(createDto);
    });

    it('should return early without calling postRecord when recordToAdd is null', () => {
      component.recordToAdd.set(null);

      component.onConfirmDialog();

      expect(mockGenericService.postRecord).not.toHaveBeenCalled();
    });

    it('should set showDetailDialog to false immediately', () => {
      component.showDetailDialog.set(true);
      mockGenericService.postRecord.and.returnValue(of({ message: 'Created', status: 201, data: mockRecord }));

      component.onConfirmDialog();

      expect(component.showDetailDialog()).toBe(false);
    });

    it('should call mapModelToCreateDto with the record', () => {
      mockGenericService.postRecord.and.returnValue(of({ message: 'Created', status: 201, data: mockRecord }));

      component.onConfirmDialog();

      expect(mockGenericService.mapModelToCreateDto).toHaveBeenCalledWith(mockRecord);
    });

    it('should call postRecord with the mapped DTO', () => {
      mockGenericService.postRecord.and.returnValue(of({ message: 'Created', status: 201, data: mockRecord }));

      component.onConfirmDialog();

      expect(mockGenericService.postRecord).toHaveBeenCalledWith(createDto);
    });

    it('should clear recordToAdd after successful creation', () => {
      mockGenericService.postRecord.and.returnValue(of({ message: 'Created', status: 201, data: mockRecord }));

      component.onConfirmDialog();

      expect(component.recordToAdd()).toBeNull();
    });

    it('should reset form after successful creation', () => {
      component.form.patchValue(validFormValues);
      mockGenericService.postRecord.and.returnValue(of({ message: 'Created', status: 201, data: mockRecord }));

      component.onConfirmDialog();

      expect(component.form.get('name')?.value).toBe('');
      expect(component.form.get('description')?.value).toBe('');
      expect(component.form.get('date')?.value).toBe('');
      expect(component.form.get('status')?.value).toBe('');
    });

    it('should navigate to generic list after successful creation', () => {
      mockGenericService.postRecord.and.returnValue(of({ message: 'Created', status: 201, data: mockRecord }));
      spyOn(router, 'navigate');

      component.onConfirmDialog();

      expect(router.navigate).toHaveBeenCalledWith(['private', 'generic', APP_ROUTES_PATH.genericList]);
    });

    it('should show error dialog on creation failure', () => {
      mockGenericService.postRecord.and.returnValue(throwError(() => ({ message: 'Create failed' })));

      component.onConfirmDialog();

      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Error al crear el registro',
        cancelText: 'cerrar',
        showConfirmButton: false
      });
    });

    it('should log error on creation failure', () => {
      const error = { message: 'Create failed' };
      mockGenericService.postRecord.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.onConfirmDialog();

      expect(console.error).toHaveBeenCalledWith('Error al crear el registro', error);
    });
  });

  describe('onCloseDialog', () => {
    it('should set recordToAdd to null', () => {
      component.recordToAdd.set(mockRecord);

      component.onCloseDialog();

      expect(component.recordToAdd()).toBeNull();
    });

    it('should set showDetailDialog to false', () => {
      component.showDetailDialog.set(true);

      component.onCloseDialog();

      expect(component.showDetailDialog()).toBe(false);
    });

    it('should reset form values', () => {
      component.form.patchValue(validFormValues);

      component.onCloseDialog();

      expect(component.form.get('name')?.value).toBe('');
      expect(component.form.get('description')?.value).toBe('');
      expect(component.form.get('date')?.value).toBe('');
      expect(component.form.get('status')?.value).toBe('');
    });
  });

  describe('reset', () => {
    it('should reset all form fields to empty strings', () => {
      component.form.patchValue(validFormValues);

      component.reset();

      expect(component.form.get('name')?.value).toBe('');
      expect(component.form.get('description')?.value).toBe('');
      expect(component.form.get('date')?.value).toBe('');
      expect(component.form.get('status')?.value).toBe('');
    });

    it('should make form invalid after reset', () => {
      component.form.patchValue(validFormValues);

      component.reset();

      expect(component.form.invalid).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete the destroy$ subject', () => {
      const destroySubject = (component as any).destroy$;
      spyOn(destroySubject, 'next').and.callThrough();
      spyOn(destroySubject, 'complete').and.callThrough();

      component.ngOnDestroy();

      expect(destroySubject.next).toHaveBeenCalled();
      expect(destroySubject.complete).toHaveBeenCalled();
    });
  });
});
