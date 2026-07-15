import { Component, inject, OnDestroy, OnInit, signal, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkeletonTableComponent } from '@shared/components/skeleton-table/skeleton-table.component';
import { GenericService } from '@private/generic/services/generic.services';
import { Subject, takeUntil } from 'rxjs';
import { GenericModel } from '@private/generic/models/generic.model';
import { DialogService } from '@core/services/dialog.service';
import { HeaderContainerComponent } from "@shared/components/header-container/header-container.component";
import { DialogDeleteConfirmationComponent } from '@shared/components/dialog-delete-confirmation/dialog-delete-confirmation.component';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';
import { TableComponent } from '@shared/components/table/table.component';
import { TableConfig } from '@shared/components/table/model/table-config';
import { TableColumnType } from '@shared/components/table/model/table-column-type';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-list-generic',
  standalone: true,
  imports: [
    CommonModule, 
    TableComponent, 
    SkeletonTableComponent, 
    HeaderContainerComponent,
    DialogDeleteConfirmationComponent,
    BreadcrumbComponent
  ],
  templateUrl: './list-generic.component.html',
  styleUrls: ['./list-generic.component.css']
})
export class ListGenericComponent implements OnInit, OnDestroy  {
  records = signal<GenericModel[]>([]);
  showDeleteDialog = signal(false);
  recordToDelete = signal<GenericModel | undefined>(undefined);
  private readonly destroy$ = new Subject<void>();

  tableConfig: TableConfig = {
    columns: [
      { title: 'Nombre', field: 'name', width: 'w-1/4', type: TableColumnType.TEXT  },
      { title: 'Descripción', field: 'description', width: 'w-1/4', type: TableColumnType.TEXT },
      { title: 'Fecha', field: 'date', width: 'w-1/6', type: TableColumnType.DATE },
      { title: 'Estado', field: 'status', width: 'w-1/4', type: TableColumnType.STATUS }
    ],
    textSize: 'xs',
    showActions: true,
    showViewDetail: true,
    showEdit: true,
    showDelete: true,
    showSearch: true,
    pageSizes: [10, 25, 50, 100]
  };
  
  isloading = signal(true);

  private readonly genericService: GenericService = inject(GenericService);
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly router: Router = inject(Router);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

  constructor() {}

  ngOnInit(): void {
    this.dialogService.setViewContainerRef(this.viewContainerRef);
    this.loadData();
  }

  loadData(): void {
    this.isloading.set(true);
    this.genericService.getRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => { 
          this.records.set(response);
          this.isloading.set(false);
        },
        error: (error) => { this.handleRequestError(error); },
      });
  }

  onViewDetail(record: GenericModel) {
    // Navegar a la página de detalle
    this.router.navigate([`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericDetail}`, record.id]);
  }

  onEditItem(record: GenericModel) {
    // Navegar a la página de edición
    this.router.navigate([`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericEdit}`, record.id]);
  }

  onAddNew() {
    // Navegar a la página de creación
    this.router.navigate([`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericForm}`]);
  }

  onRefresh() {
    // Recargar los datos de la tabla
    this.loadData();
  }

  onDeleteItem(record: GenericModel) {
    this.recordToDelete.set(record);
    this.showDeleteDialog.set(true);
  }

  onCloseDeleteDialog() {
    this.showDeleteDialog.set(false);
    this.recordToDelete.set(undefined);
  }

  onConfirmDelete() {
    const record = this.recordToDelete();
    if (record) {
      this.genericService.deleteRecord(record.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadData(); // Recargar datos después de eliminar
            this.onCloseDeleteDialog();
            this.dialogService.info({
              title: 'Éxito',
              message: 'El registro ha sido eliminado correctamente.',
              cancelText: 'Cerrar',
              showConfirmButton: false
            });
          },
          error: (error: unknown) => { 
            this.onCloseDeleteDialog();
            this.handleRequestError(error); 
          },
        });
    }
  }

  private handleRequestError(error: unknown) {
    this.dialogService.error({
      title: 'Error',
      message: 'Ha ocurrido un error al cargar los datos.',
      cancelText: 'cerrar',
      showConfirmButton: false
    });
    console.error(error);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}