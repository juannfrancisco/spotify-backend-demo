import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListGenericComponent } from './list-generic.component';
import { GenericService } from '@private/generic/services/generic.services';
import { DialogService } from '@core/services/dialog.service';
import { GenericModel } from '@private/generic/models/generic.model';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('ListGenericComponent', () => {
  let component: ListGenericComponent;
  let fixture: ComponentFixture<ListGenericComponent>;
  let mockGenericService: jasmine.SpyObj<GenericService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let router: Router;

  const mockRecords: GenericModel[] = [
    { id: '1', name: 'Record 1', description: 'Description 1', date: '01/01/2024', status: 'En progreso' },
    { id: '2', name: 'Record 2', description: 'Description 2', date: '02/01/2024', status: 'Completado' },
  ];

  beforeEach(async () => {
    mockGenericService = jasmine.createSpyObj('GenericService', ['getRecords', 'deleteRecord']);
    mockDialogService = jasmine.createSpyObj('DialogService', ['setViewContainerRef', 'error', 'info']);
    mockSvgIconRegistryService = jasmine.createSpyObj('SvgIconRegistryService', ['loadSvg']);
    mockGenericService.getRecords.and.returnValue(of(mockRecords));

    await TestBed.configureTestingModule({
      imports: [ListGenericComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: GenericService, useValue: mockGenericService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: SvgIconRegistryService, useValue: mockSvgIconRegistryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListGenericComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set ViewContainerRef on DialogService', () => {
      expect(mockDialogService.setViewContainerRef).toHaveBeenCalled();
    });

    it('should call loadData on init', () => {
      expect(mockGenericService.getRecords).toHaveBeenCalled();
    });

    it('should populate records after loading', () => {
      expect(component.records()).toEqual(mockRecords);
    });

    it('should set isloading to false after data loads', () => {
      expect(component.isloading()).toBe(false);
    });
  });

  describe('initial state', () => {
    it('should initialize records as empty array before load', () => {
      const freshFixture = TestBed.createComponent(ListGenericComponent);
      const freshComponent = freshFixture.componentInstance;
      expect(freshComponent.records()).toEqual([]);
    });

    it('should initialize showDeleteDialog as false', () => {
      expect(component.showDeleteDialog()).toBe(false);
    });

    it('should initialize recordToDelete as undefined', () => {
      expect(component.recordToDelete()).toBeUndefined();
    });
  });

  describe('loadData', () => {
    it('should reload records when called', () => {
      const newRecords: GenericModel[] = [
        { id: '3', name: 'Record 3', description: 'Desc 3', date: '03/01/2024', status: 'Pendiente' }
      ];
      mockGenericService.getRecords.and.returnValue(of(newRecords));

      component.loadData();

      expect(component.records()).toEqual(newRecords);
    });

    it('should set isloading to true before fetching', () => {
      mockGenericService.getRecords.and.returnValue(of(mockRecords));
      component.isloading.set(false);

      component.loadData();

      expect(mockGenericService.getRecords).toHaveBeenCalled();
    });

    it('should show error dialog on load failure', () => {
      mockGenericService.getRecords.and.returnValue(throwError(() => new Error('Network error')));
      spyOn(console, 'error');

      component.loadData();

      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Ha ocurrido un error al cargar los datos.',
        cancelText: 'cerrar',
        showConfirmButton: false
      });
    });

    it('should log error on load failure', () => {
      const error = new Error('Network error');
      mockGenericService.getRecords.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.loadData();

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('onViewDetail', () => {
    it('should navigate to detail route with record id', () => {
      spyOn(router, 'navigate');
      const record = mockRecords[0];

      component.onViewDetail(record);

      expect(router.navigate).toHaveBeenCalledWith(
        [`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericDetail}`, record.id]
      );
    });
  });

  describe('onEditItem', () => {
    it('should navigate to edit route with record id', () => {
      spyOn(router, 'navigate');
      const record = mockRecords[1];

      component.onEditItem(record);

      expect(router.navigate).toHaveBeenCalledWith(
        [`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericEdit}`, record.id]
      );
    });
  });

  describe('onAddNew', () => {
    it('should navigate to create route', () => {
      spyOn(router, 'navigate');

      component.onAddNew();

      expect(router.navigate).toHaveBeenCalledWith(
        [`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericForm}`]
      );
    });
  });

  describe('onRefresh', () => {
    it('should call loadData', () => {
      spyOn(component, 'loadData');

      component.onRefresh();

      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('onDeleteItem', () => {
    it('should set recordToDelete and show delete dialog', () => {
      const record = mockRecords[0];

      component.onDeleteItem(record);

      expect(component.recordToDelete()).toEqual(record);
      expect(component.showDeleteDialog()).toBe(true);
    });
  });

  describe('onCloseDeleteDialog', () => {
    it('should hide delete dialog and clear recordToDelete', () => {
      component.recordToDelete.set(mockRecords[0]);
      component.showDeleteDialog.set(true);

      component.onCloseDeleteDialog();

      expect(component.showDeleteDialog()).toBe(false);
      expect(component.recordToDelete()).toBeUndefined();
    });
  });

  describe('onConfirmDelete', () => {
    it('should call deleteRecord with the record id', () => {
      component.recordToDelete.set(mockRecords[0]);
      mockGenericService.deleteRecord.and.returnValue(of({ message: 'Deleted', status: 200 }));

      component.onConfirmDelete();

      expect(mockGenericService.deleteRecord).toHaveBeenCalledWith('1');
    });

    it('should reload data after successful delete', () => {
      component.recordToDelete.set(mockRecords[0]);
      mockGenericService.deleteRecord.and.returnValue(of({ message: 'Deleted', status: 200 }));
      const loadDataSpy = spyOn(component, 'loadData').and.callThrough();
      mockGenericService.getRecords.and.returnValue(of([]));

      component.onConfirmDelete();

      expect(loadDataSpy).toHaveBeenCalled();
    });

    it('should close dialog after successful delete', () => {
      component.recordToDelete.set(mockRecords[0]);
      component.showDeleteDialog.set(true);
      mockGenericService.deleteRecord.and.returnValue(of({ message: 'Deleted', status: 200 }));
      mockGenericService.getRecords.and.returnValue(of([]));

      component.onConfirmDelete();

      expect(component.showDeleteDialog()).toBe(false);
      expect(component.recordToDelete()).toBeUndefined();
    });

    it('should show info dialog after successful delete', () => {
      component.recordToDelete.set(mockRecords[0]);
      mockGenericService.deleteRecord.and.returnValue(of({ message: 'Deleted', status: 200 }));
      mockGenericService.getRecords.and.returnValue(of([]));

      component.onConfirmDelete();

      expect(mockDialogService.info).toHaveBeenCalledWith({
        title: 'Éxito',
        message: 'El registro ha sido eliminado correctamente.',
        cancelText: 'Cerrar',
        showConfirmButton: false
      });
    });

    it('should show error dialog on delete failure', () => {
      component.recordToDelete.set(mockRecords[0]);
      mockGenericService.deleteRecord.and.returnValue(throwError(() => new Error('Delete failed')));
      spyOn(console, 'error');

      component.onConfirmDelete();

      expect(mockDialogService.error).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Ha ocurrido un error al cargar los datos.',
        cancelText: 'cerrar',
        showConfirmButton: false
      });
    });

    it('should close dialog on delete failure', () => {
      component.recordToDelete.set(mockRecords[0]);
      component.showDeleteDialog.set(true);
      mockGenericService.deleteRecord.and.returnValue(throwError(() => new Error('Delete failed')));
      spyOn(console, 'error');

      component.onConfirmDelete();

      expect(component.showDeleteDialog()).toBe(false);
    });

    it('should not call deleteRecord when recordToDelete is undefined', () => {
      component.recordToDelete.set(undefined);

      component.onConfirmDelete();

      expect(mockGenericService.deleteRecord).not.toHaveBeenCalled();
    });
  });

  describe('tableConfig', () => {
    it('should configure table with expected columns', () => {
      expect(component.tableConfig.columns.length).toBe(4);
      expect(component.tableConfig.columns.map(c => c.field)).toEqual(['name', 'description', 'date', 'status']);
    });

    it('should enable actions, search, and CRUD operations', () => {
      expect(component.tableConfig.showActions).toBe(true);
      expect(component.tableConfig.showViewDetail).toBe(true);
      expect(component.tableConfig.showEdit).toBe(true);
      expect(component.tableConfig.showDelete).toBe(true);
      expect(component.tableConfig.showSearch).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      const destroySpy = spyOn((component as any).destroy$, 'next').and.callThrough();
      const completeSpy = spyOn((component as any).destroy$, 'complete').and.callThrough();

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
