import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-skeleton-table',
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-w-full flex-col overflow-hidden rounded-xl border border-border bg-background text-card-foreground dark:bg-card">

      <!-- Toolbar skeleton -->
      @if (showToolbar()) {
        <div class="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          @if (showSearch()) {
            <ngx-skeleton-loader
              [theme]="{
                width: '240px',
                height: '36px',
                'border-radius': borderRadius(),
                'background-color': backgroundColor(),
                border: border(),
                margin: '0'
              }">
            </ngx-skeleton-loader>
          }
          <div class="flex flex-shrink-0 items-center gap-2">
            @if (showAddButton()) {
              <ngx-skeleton-loader
                [theme]="{
                  width: '100px',
                  height: '36px',
                  'border-radius': borderRadius(),
                  'background-color': backgroundColor(),
                  border: border(),
                  margin: '0'
                }">
              </ngx-skeleton-loader>
            }
            <ngx-skeleton-loader
              [theme]="{
                width: '36px',
                height: '36px',
                'border-radius': borderRadius(),
                'background-color': backgroundColor(),
                border: border(),
                margin: '0'
              }">
            </ngx-skeleton-loader>
          </div>
        </div>
      }

      <!-- Table header + rows skeleton -->
      <div class="relative hidden w-full overflow-auto md:block">
        <!-- Header row -->
        <div class="flex w-full items-center border-b border-border bg-muted/30 px-4" style="height: 40px;">
          @for (col of columnWidths(); track $index) {
            <div [style.width]="col" [style.flex]="'0 0 ' + col" class="px-2">
              <ngx-skeleton-loader
                [theme]="{
                  width: '70%',
                  height: '12px',
                  'border-radius': borderRadius(),
                  'background-color': backgroundColor(),
                  border: border(),
                  margin: '0',
                  display: 'block'
                }">
              </ngx-skeleton-loader>
            </div>
          }
        </div>
        <!-- Data rows -->
        @for (row of rows(); track $index) {
          <div
            class="flex w-full items-center border-b border-border px-4"
            style="height: 48px;"
            [class.bg-muted]="$index % 2 !== 0">
            @for (col of columnWidths(); track $index) {
              <div [style.width]="col" [style.flex]="'0 0 ' + col" class="px-2">
                <ngx-skeleton-loader
                  [theme]="{
                    width: '85%',
                    height: '16px',
                    'border-radius': borderRadius(),
                    'background-color': backgroundColor(),
                    border: border(),
                    'animation-duration': animationDuration(),
                    margin: '0',
                    display: 'block'
                  }">
                </ngx-skeleton-loader>
              </div>
            }
          </div>
        }
      </div>

      <!-- Mobile card skeleton -->
      <div class="block md:hidden divide-y divide-border">
        @for (row of rows(); track $index) {
          <div class="grid grid-cols-2 gap-x-4 gap-y-3 p-4">
            @for (col of columnWidths(); track $index) {
              <div class="flex flex-col gap-1">
                <ngx-skeleton-loader
                  [theme]="{
                    width: '60px',
                    height: '10px',
                    'border-radius': borderRadius(),
                    'background-color': backgroundColor(),
                    border: border(),
                    margin: '0'
                  }">
                </ngx-skeleton-loader>
                <ngx-skeleton-loader
                  [theme]="{
                    width: '100%',
                    height: '18px',
                    'border-radius': borderRadius(),
                    'background-color': backgroundColor(),
                    border: border(),
                    'animation-duration': animationDuration(),
                    margin: '0'
                  }">
                </ngx-skeleton-loader>
              </div>
            }
          </div>
        }
      </div>

      <!-- Pagination footer skeleton -->
      @if (showPagination()) {
        <div class="flex flex-col items-center justify-between gap-3 border-t border-border bg-muted/10 px-4 py-3 sm:flex-row">
          <!-- Page size selector -->
          <ngx-skeleton-loader
            [theme]="{
              width: '180px',
              height: '32px',
              'border-radius': borderRadius(),
              'background-color': backgroundColor(),
              border: border(),
              margin: '0'
            }">
          </ngx-skeleton-loader>

          <!-- Page info + buttons -->
          <div class="flex items-center gap-3">
            <ngx-skeleton-loader
              [theme]="{
                width: '120px',
                height: '16px',
                'border-radius': borderRadius(),
                'background-color': backgroundColor(),
                border: border(),
                margin: '0'
              }">
            </ngx-skeleton-loader>
            <div class="flex items-center gap-1">
              @for (btn of pageButtons(); track $index) {
                <ngx-skeleton-loader
                  [theme]="{
                    width: '32px',
                    height: '32px',
                    'border-radius': borderRadius(),
                    'background-color': backgroundColor(),
                    border: border(),
                    margin: '0'
                  }">
                </ngx-skeleton-loader>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class SkeletonTableComponent {
  showToolbar = input(true);
  showSearch = input(true);
  showAddButton = input(true);
  showPagination = input(true);
  rowCount = input(10);
  columnWidths = input<string[]>(['20%', '20%', '20%', '20%', '10%', '10%']);
  borderRadius = input('6px');
  animationDuration = input('1.5s');

  backgroundColor = signal('#e5e7eb');
  border = signal('1px solid #d1d5db');

  readonly rows = signal<null[]>([]);
  readonly pageButtons = signal<null[]>(Array(6).fill(null));

  private themeService = inject(ThemeService);

  constructor() {
    effect(() => {
      this.rows.set(Array(this.rowCount()).fill(null));
    });

    effect(() => {
      const isDark = this.themeService.isDark;
      if (isDark) {
        this.backgroundColor.set('#374151');
        this.border.set('1px solid #4b5563');
      } else {
        this.backgroundColor.set('#e5e7eb');
        this.border.set('1px solid #d1d5db');
      }
    });
  }
}