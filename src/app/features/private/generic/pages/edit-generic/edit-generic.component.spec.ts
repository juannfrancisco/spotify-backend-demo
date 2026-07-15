import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, of, throwError } from 'rxjs';
import { EditGenericComponent } from './edit-generic.component';
import { GenericService } from '@private/generic/services/generic.services';
import { DialogService } from '@core/services/dialog.service';
import { GenericModel } from '@private/generic/models/generic.model';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('EditGenericComponent', () => {
  let component: EditGenericComponent;
  let fixture: ComponentFixture<EditGenericComponent>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockGenericService: jasmine.SpyObj<GenericService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;

  const mockRecord: GenericModel = {
    id: '1',
    name: 'Test Record',
    description: 'Test Description',
    date: '01/01/2024',
    status: 'En progreso'
  };

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ id: '1' }),
      snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('1') } }
    };

    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], { events: EMPTY, url: '/' });
    mockRouter.createUrlTree.and.returnValue({} as any);
    mockRouter.serializeUrl.and.returnValue('');
    mockGenericService = jasmine.createSpyObj('GenericService', [
      'getRecordById',
      'putRecord',
      'mapModelToUpdateDto'
    ]);
    mockDialogService = jasmine.createSpyObj('DialogService', [
      'setViewContainerRef',
      'error',
      'info'
    ]);
    mockSvgIconRegistryService = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);

    await TestBed.configureTestingModule({
      imports: [EditGenericComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: GenericService, useValue: mockGenericService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: SvgIconRegistryService, useValue: mockSvgIconRegistryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditGenericComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form and load record', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));

      fixture.detectChanges();

      expect(component.form).toBeDefined();
      expect(mockDialogService.setViewContainerRef).toHaveBeenCalled();
      expect(mockGenericService.getRecordById).toHaveBeenCalledWith('1');
    });

    it('should set isLoading to false after record loads successfully', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));

      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
    });

    it('should navigate to list when no record ID is provided', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

      fixture.detectChanges();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/private/generic/history']);
    });

    it('should handle record not found', () => {
      mockGenericService.getRecordById.and.returnValue(of(undefined));

      fixture.detectChanges();

      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'No se encontró el registro solicitado',
        cancelText: 'Cerrar',
        showConfirmButton: false
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/private/generic/history']);
    });

    it('should handle load record error', () => {
      const errorMessage = 'Network error';
      mockGenericService.getRecordById.and.returnValue(throwError(() => ({ message: errorMessage })));
      spyOn(console, 'error');

      fixture.detectChanges();

      expect(console.error).toHaveBeenCalledWith('Error al cargar el registro:', { message: errorMessage });
      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Error al cargar el registro',
        cancelText: 'Cerrar',
        showConfirmButton: false
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/private/generic/history']);
    });
  });

  describe('populateForm', () => {
    it('should populate form with record data and format date DD/MM/YYYY to YYYY-MM-DD', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));

      fixture.detectChanges();

      expect(component.form.get('id')?.value).toBe('1');
      expect(component.form.get('name')?.value).toBe('Test Record');
      expect(component.form.get('description')?.value).toBe('Test Description');
      expect(component.form.get('date')?.value).toBe('2024-01-01');
      expect(component.form.get('status')?.value).toBe('En progreso');
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();
    });

    it('should show error when form is invalid', () => {
      component.form.patchValue({ name: '', description: '', date: '', status: '' });

      component.onSubmit();

      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Por favor, complete todos los campos requeridos',
        cancelText: 'Cerrar',
        showConfirmButton: false
      });
    });

    it('should mark all non-id controls as touched when form is invalid', () => {
      component.form.patchValue({ name: '', description: '', date: '', status: '' });

      component.onSubmit();

      expect(component.form.get('name')?.touched).toBeTrue();
      expect(component.form.get('description')?.touched).toBeTrue();
      expect(component.form.get('date')?.touched).toBeTrue();
      expect(component.form.get('status')?.touched).toBeTrue();
    });

    it('should show confirmation dialog when form is valid', () => {
      component.form.patchValue({
        name: 'Test Name',
        description: 'Test Description',
        date: '2024-01-01',
        status: 'En progreso'
      });

      component.onSubmit();

      expect(component.showDetailDialog()).toBe(true);
      expect(component.recordToUpdate()).toEqual({
        id: '1',
        name: 'Test Name',
        description: 'Test Description',
        date: '01/01/2024',
        status: 'En progreso'
      });
    });

    it('should format date from YYYY-MM-DD to DD/MM/YYYY on submit', () => {
      component.form.patchValue({
        name: 'Test Name',
        description: 'Test Description',
        date: '2024-06-15',
        status: 'En progreso'
      });

      component.onSubmit();

      expect(component.recordToUpdate()?.date).toBe('15/06/2024');
    });
  });

  describe('onConfirmDialog', () => {
    beforeEach(() => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();
      component.recordToUpdate.set(mockRecord);
    });

    it('should update record successfully and navigate after delay', fakeAsync(() => {
      const updateDto = { name: 'Updated Name' };
      mockGenericService.mapModelToUpdateDto.and.returnValue(updateDto);
      mockGenericService.putRecord.and.returnValue(of({ message: 'Updated', status: 200, data: mockRecord }));

      component.onConfirmDialog();

      expect(mockGenericService.putRecord).toHaveBeenCalledWith('1', updateDto);
      expect(component.showDetailDialog()).toBe(false);
      expect(component.recordToUpdate()).toBe(null);
      expect(mockDialogService.info).toHaveBeenCalledWith({
        title: 'Registro actualizado',
        message: 'El registro se actualizó correctamente',
        cancelText: 'Cerrar',
        showConfirmButton: false
      });

      tick(1500);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/private/generic/history']);
    }));

    it('should handle update error', () => {
      const updateDto = { name: 'Updated Name' };
      mockGenericService.mapModelToUpdateDto.and.returnValue(updateDto);
      mockGenericService.putRecord.and.returnValue(throwError(() => ({ message: 'Update failed' })));
      spyOn(console, 'error');

      component.onConfirmDialog();

      expect(console.error).toHaveBeenCalledWith('Error al actualizar el registro', { message: 'Update failed' });
      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Error al actualizar el registro',
        cancelText: 'Cerrar',
        showConfirmButton: false
      });
    });

    it('should return early when no record to update', () => {
      component.recordToUpdate.set(null);

      component.onConfirmDialog();

      expect(mockGenericService.putRecord).not.toHaveBeenCalled();
    });
  });

  describe('onCloseDialog', () => {
    it('should close dialog and reset record to update', () => {
      component.recordToUpdate.set(mockRecord);
      component.showDetailDialog.set(true);

      component.onCloseDialog();

      expect(component.recordToUpdate()).toBe(null);
      expect(component.showDetailDialog()).toBe(false);
    });
  });

  describe('onCancel', () => {
    it('should navigate to list', () => {
      component.onCancel();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/private/generic/history']);
    });
  });

  describe('onReset', () => {
    it('should reset form to original record data', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();

      component.form.patchValue({ name: 'Changed Name' });
      component.onReset();

      expect(component.form.get('name')?.value).toBe('Test Record');
    });

    it('should not reset when no record exists', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();

      component.record.set(null);
      component.form.patchValue({ name: 'Changed Name' });

      component.onReset();

      expect(component.form.get('name')?.value).toBe('Changed Name');
    });
  });

  describe('date formatting', () => {
    it('should format date from DD/MM/YYYY to YYYY-MM-DD for input', () => {
      mockGenericService.getRecordById.and.returnValue(of({ ...mockRecord, date: '15/06/2024' }));

      fixture.detectChanges();

      expect(component.form.get('date')?.value).toBe('2024-06-15');
    });

    it('should handle date already in YYYY-MM-DD format', () => {
      mockGenericService.getRecordById.and.returnValue(of({ ...mockRecord, date: '2024-06-15' }));

      fixture.detectChanges();

      expect(component.form.get('date')?.value).toBe('2024-06-15');
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject to unsubscribe observables', () => {
      mockGenericService.getRecordById.and.returnValue(of(mockRecord));
      fixture.detectChanges();

      const destroySpy = spyOn((component as any).destroy$, 'next').and.callThrough();
      const completeSpy = spyOn((component as any).destroy$, 'complete').and.callThrough();

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('statuses signal', () => {
    it('should expose the four predefined statuses', () => {
      const statuses = component.statuses();

      expect(statuses.length).toBe(4);
      expect(statuses.map(s => s.name)).toEqual([
        'En progreso', 'Completado', 'Pendiente', 'Cancelado'
      ]);
    });
  });
});
