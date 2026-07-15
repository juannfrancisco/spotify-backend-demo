import { Component, inject, OnDestroy, OnInit, signal, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericModel } from '@private/generic/models/generic.model';
import { GenericService } from '@private/generic/services/generic.services';
import { DialogService } from '@core/services/dialog.service';
import { HeaderContainerComponent } from '@shared/components/header-container/header-container.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-detail-generic',
  standalone: true,
  imports: [
    CommonModule,
    HeaderContainerComponent,
    StatusBadgeComponent,
    BreadcrumbComponent
  ],
  templateUrl: './detail-generic.component.html',
  styleUrls: ['./detail-generic.component.css']
})
export class DetailGenericComponent implements OnInit, OnDestroy {
  record = signal<GenericModel | null>(null);
  isLoading = signal(true);
  recordId = signal<string>('');
  private readonly destroy$ = new Subject<void>();
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly genericService: GenericService = inject(GenericService);
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

  constructor() {}

  ngOnInit(): void {
    // Configurar el ViewContainerRef para el DialogService
    this.dialogService.setViewContainerRef(this.viewContainerRef);
    
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.recordId.set(id);
          this.loadRecordDetail(id);
        } else {
          this.handleError('No se proporcionó un ID válido');
        }
      });
  }

  private loadRecordDetail(id: string): void {
    this.isLoading.set(true);
    this.genericService.getRecordById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (record) => {
          if (record) {
            this.record.set(record);
          } else {
            this.handleError('No se encontró el registro solicitado');
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.handleError('Error al cargar el detalle del registro');
          this.isLoading.set(false);
        }
      });
  }

  onGoBack(): void {
    this.router.navigate([`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericList}`]);
  }

  onEdit(): void {
    // Navegar a la página de edición (por implementar)
    this.router.navigate([`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericEdit}`, this.recordId()]);
  }

  private handleError(message: string): void {
    this.dialogService.error({
      title: 'Error',
      message: message,
      cancelText: 'Cerrar',
      showConfirmButton: false
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
