import { inject, Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;
  public isLoadingFlag = signal(false);
  private readonly spinner: NgxSpinnerService = inject(NgxSpinnerService);

  constructor() {}

  show() {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.spinner.show();
      this.isLoadingFlag.set(true);
    }
  }

  hide() {
    this.loadingCount--;
    if (this.loadingCount === 0) {
      this.spinner.hide();
      this.isLoadingFlag.set(false);
    }
  }

  isLoading(): boolean {
    return this.loadingCount > 0;
  }
}
