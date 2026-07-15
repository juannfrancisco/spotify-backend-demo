import { Component, inject, OnDestroy, OnInit, signal, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericModel } from '@private/generic/models/generic.model';
import { GenericService } from '@private/generic/services/generic.services';
import { DialogService } from '@core/services/dialog.service';
import { Subject } from 'rxjs';
import { DialogComponent } from "@shared/components/dialog/dialog.component";
import { StatusBadgeComponent } from "@shared/components/status-badge/status-badge.component";
import { HeaderContainerComponent } from "@shared/components/header-container/header-container.component";
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { toast } from 'ngx-sonner';
import { APP_ROUTES_PATH } from '@shared/constants/app-routes.constants';

@Component({
  selector: 'app-create-generic',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    DialogComponent, 
    StatusBadgeComponent, 
    HeaderContainerComponent, 
    BreadcrumbComponent, 
    ButtonComponent
  ],
  templateUrl: './create-generic.component.html',
  styleUrls: ['./create-generic.component.css']
})
export class CreateGenericComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  recordToAdd = signal<GenericModel | null>(null);
  showDetailDialog = signal(false);
  private readonly destroy$ = new Subject<void>();
  statuses = signal<{ id: number, name: string }[]>([
    { id: 1, name: 'En progreso' },
    { id: 2, name: 'Completado' },
    { id: 3, name: 'Pendiente' },
    { id: 4, name: 'Cancelado' },
  ]);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly genericService: GenericService = inject(GenericService);
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly router: Router = inject(Router);

  constructor() {
    this.dialogService.setViewContainerRef(this.viewContainerRef);
  }

  ngOnInit(): void {
    this.initForm();
  }


  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  private formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.markAsTouched();
        }
      });

      this.dialogService.error({
        title: 'Error',
        message: 'Por favor, complete todos los campos requeridos',
        cancelText: 'cerrar',
        showConfirmButton: false
      });
      return;
    }
    const formattedDate = this.formatDate(this.form.value.date);
    const recordData: GenericModel = {
      ...this.form.value,
      date: formattedDate,
    };

    this.recordToAdd.set(recordData);
    this.showDetailDialog.set(true);
  }

  onConfirmDialog(): void {
    this.showDetailDialog.set(false);

    if (!this.recordToAdd()) return;

    const recordToAdd = this.recordToAdd()!;
    const createDto = this.genericService.mapModelToCreateDto(recordToAdd);

    this.genericService.postRecord(createDto).subscribe({
      next: () => {
        this.recordToAdd.set(null);
        this.reset();
        toast.success('El registro se creó correctamente', {duration: 3000, position: 'bottom-center', closeButton: true});
        this.router.navigate(['private', 'generic', APP_ROUTES_PATH.genericList]);
      },
      error: (error) => {
        this.dialogService.error({
          title: 'Error',
          message: 'Error al crear el registro',
          cancelText: 'cerrar',
          showConfirmButton: false
        });
        console.error('Error al crear el registro', error);
      }
    });
  }

  onCloseDialog(): void {
    this.recordToAdd.set(null);
    this.reset();
    this.showDetailDialog.set(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reset(): void {
    this.form.reset({
      name: '',
      description: '',
      date: '',
      status: ''
    });
  }
}
