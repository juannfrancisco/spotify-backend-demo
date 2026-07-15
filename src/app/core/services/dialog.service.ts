import { Injectable, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

export interface DialogConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  showConfirmButton?: boolean;
  showFooter?: boolean;
  showCancelButton?: boolean;
  onClose?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private viewContainerRef!: ViewContainerRef;

  setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  private createDialog(config: DialogConfig) {
    if (!this.viewContainerRef) {
      throw new Error(
        'ViewContainerRef not set. Call setViewContainerRef first.'
      );
    }

    const componentRef = this.viewContainerRef.createComponent(DialogComponent);
    const instance = componentRef.instance;

    instance.title = config.title ?? '';
    instance.confirmText = config.confirmText ?? 'Aceptar';
    instance.cancelText = config.cancelText ?? 'Cancelar';
    instance.showConfirmButton = config.showConfirmButton ?? true;
    instance.showFooter = config.showFooter ?? true;
    instance.message = config.message ?? '';
    instance.showCancelButton = config.showCancelButton ?? false;
    instance.isOpen = true;

    const closeDialog = () => {
      instance.isOpen = false;
      if (config.onClose) {
        config.onClose();
      }
      setTimeout(() => {
        componentRef.destroy();
      }, 100);
    };

    instance.close.subscribe(() => closeDialog());
    instance.confirm.subscribe(() => closeDialog());

    return { componentRef, closeDialog };
  }

  alert(config: DialogConfig): Promise<void> {
    const { componentRef } = this.createDialog({
      ...config,
      showFooter: true,
    });

    return new Promise((resolve) => {
      componentRef.instance.confirm.subscribe(() => {
        resolve();
      });
    });
  }

  confirm(config: DialogConfig): Promise<boolean> {
    const { componentRef } = this.createDialog({
      ...config,
      showConfirmButton: true,
      showFooter: true,
      showCancelButton: config.showCancelButton ?? true
    });

    return new Promise((resolve) => {
      componentRef.instance.confirm.subscribe(() => {
        resolve(true);
      });

      componentRef.instance.close.subscribe(() => {
        resolve(false);
      });
    });
  }

  info(config: DialogConfig): Promise<void> {
    return this.alert({
      ...config,
    });
  }

  error(config: DialogConfig): Promise<void> {
    return this.alert({
      ...config,
      title: config.title ?? 'Error',
      confirmText: config.confirmText ?? 'Entendido',
    });
  }
}
