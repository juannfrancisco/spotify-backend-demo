import { Component, inject, OnDestroy, OnInit, signal, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericModel } from '@private/generic/models/generic.model';
import { GenericService } from '@private/generic/services/generic.services';
import { DialogService } from '@core/services/dialog.service';
import { DialogComponent } from "@shared/components/dialog/dialog.component";
import { StatusBadgeComponent } from "@shared/components/status-badge/status-badge.component";
import { HeaderContainerComponent } from "@shared/components/header-container/header-container.component";
import { APP_ROUTES_PATH } from '@constants/app-routes.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-edit-generic',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    DialogComponent, 
    StatusBadgeComponent, 
    HeaderContainerComponent, 
    BreadcrumbComponent,
    ButtonComponent
  ],
  templateUrl: './edit-generic.component.html',
  styleUrls: ['./edit-generic.component.css']
})
export class EditGenericComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  record = signal<GenericModel | null>(null);
  recordToUpdate = signal<GenericModel | null>(null);
  showDetailDialog = signal(false);
  isLoading = signal(true);
  recordId: string | null = null;
  private readonly destroy$ = new Subject<void>();
  
  statuses = signal<{id: number, name: string}[]>([
    { id: 1, name: 'En progreso' },
    { id: 2, name: 'Completado' },
    { id: 3, name: 'Pendiente' },
    { id: 4, name: 'Cancelado' },
  ]);

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly genericService: GenericService = inject(GenericService);
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

  constructor() {}

  ngOnInit(): void {
    this.dialogService.setViewContainerRef(this.viewContainerRef);
    this.initForm();
    this.loadRecord();
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: [{value: '', disabled: true}, Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  private loadRecord(): void {
    this.recordId = this.route.snapshot.paramMap.get('id');
    
    if (!this.recordId) {
      this.navigateToList();
      return;
    }

    this.isLoading.set(true);
    this.genericService.getRecordById(this.recordId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.record.set(response);
            this.populateForm(response);
            this.isLoading.set(false);
          } else {
            this.dialogService.error({
              title: 'Error',
              message: 'No se encontró el registro solicitado',
              cancelText: 'Cerrar',
              showConfirmButton: false
            });
            this.navigateToList();
          }
        },
        error: (error) => {
          console.error('Error al cargar el registro:', error);
          this.dialogService.error({
            title: 'Error',
            message: 'Error al cargar el registro',
            cancelText: 'Cerrar',
            showConfirmButton: false
          });
          this.navigateToList();
        }
      });
  }

  private populateForm(record: GenericModel): void {
    // Convertir la fecha del formato DD/MM/YYYY a YYYY-MM-DD para el input date
    const formattedDate = this.formatDateForInput(record.date);
    
    this.form.patchValue({
      id: record.id,
      name: record.name,
      description: record.description,
      date: formattedDate,
      status: record.status
    });
  }

  private formatDateForInput(date: string): string {
    // Si la fecha viene en formato DD/MM/YYYY, convertir a YYYY-MM-DD
    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return date; // Si ya está en formato correcto
  }

  private formatDateForDisplay(date: string): string {
    // Convertir de YYYY-MM-DD a DD/MM/YYYY
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control && key !== 'id') { // No marcar el ID como touched ya que está deshabilitado
          control.markAsTouched();
        }
      });

      this.dialogService.error({
        title: 'Error',
        message: 'Por favor, complete todos los campos requeridos',
        cancelText: 'Cerrar',
        showConfirmButton: false
      });
      return;
    }

    const formattedDate = this.formatDateForDisplay(this.form.value.date);
    const recordData: GenericModel = {
      id: this.recordId!,
      name: this.form.value.name,
      description: this.form.value.description,
      date: formattedDate,
      status: this.form.value.status
    };

    this.recordToUpdate.set(recordData);
    this.showDetailDialog.set(true);
  }

onConfirmDialog(): void {
    this.showDetailDialog.set(false);
    
    if (!this.recordToUpdate()) return;

    const recordToUpdate = this.recordToUpdate()!;
    const updateDto = this.genericService.mapModelToUpdateDto(recordToUpdate);

    this.genericService.putRecord(recordToUpdate.id, updateDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.recordToUpdate.set(null);
          this.dialogService.info({
            title: 'Registro actualizado',
            message: 'El registro se actualizó correctamente',
            cancelText: 'Cerrar',
            showConfirmButton: false
          });
          
          // Redirigir a la lista después de la actualización exitosa
          setTimeout(() => {
            this.navigateToList();
          }, 1500);
        },
        error: (error) => {
          this.dialogService.error({
            title: 'Error',
            message: 'Error al actualizar el registro',
            cancelText: 'Cerrar',
            showConfirmButton: false
          });
          console.error('Error al actualizar el registro', error);
        }
      });
  }
  
  onCloseDialog(): void {
    this.recordToUpdate.set(null);
    this.showDetailDialog.set(false);
  }

  onCancel(): void {
    this.navigateToList();
  }

  onReset(): void {
    if (this.record()) {
      this.populateForm(this.record()!);
    }
  }

  private navigateToList(): void {
    this.router.navigate([`/${APP_ROUTES_PATH.private}/${APP_ROUTES_PATH.generic}/${APP_ROUTES_PATH.genericList}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
