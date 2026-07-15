import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { TableConfig } from './model/table-config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [DatePipe, AngularSvgIconModule, StatusBadgeComponent, RouterLink],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  // --- Inputs ---
  config = input<TableConfig>({
    columns: [],
    pageSizes: [10, 25, 50, 100],
    showSearch: true,
    showViewDetail: true,
    showEdit: true,
    showDelete: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data = input<any[]>([]);

  // --- Outputs ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewDetail = output<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editItem = output<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteItem = output<any>();
  addNew = output<void>();
  refresh = output<void>();

  // --- Internal state ---
  protected readonly searchTerm = signal('');
  protected readonly pageSize = signal(10);
  protected readonly currentPage = signal(1);
  protected readonly sortField = signal<string | null>(null);
  protected readonly sortDirection = signal<'asc' | 'desc'>('asc');
  protected readonly selectFilterValues = signal<Record<string, string>>({});
  protected readonly showFilters = signal(false);

  // --- Derived state ---
  private readonly processedData = computed(() => {
    let filtered = this.data();

    // Apply search filter
    const term = this.searchTerm().toLowerCase();
    if (term) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) => String(value).toLowerCase().includes(term)),
      );
    }

    // Apply select filters
    const activeFilters = this.selectFilterValues();
    for (const [field, value] of Object.entries(activeFilters)) {
      if (value !== '') {
        filtered = filtered.filter((item) => String(item[field]) === value);
      }
    }

    // Apply sorting
    const field = this.sortField();
    if (field) {
      const direction = this.sortDirection();
      filtered = filtered.slice().sort((a, b) => {
        const valueA = String(a[field] ?? '').toLowerCase();
        const valueB = String(b[field] ?? '').toLowerCase();
        return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
    }

    return filtered;
  });

  protected readonly totalItems = computed(() => this.processedData().length);
  protected readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);

  protected readonly filteredData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.processedData().slice(start, end);
  });

  protected readonly paginationStart = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  protected readonly paginationEnd = computed(() => {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalItems());
  });

  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push(-1); // Ellipsis marker
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push(-2); // Ellipsis marker
      }

      // Always show last page
      pages.push(total);
    }

    return pages;
  });

  protected readonly selectFilterOptions = computed(() => {
    const filters = this.config().selectFilters ?? [];
    const data = this.data();
    const result: Record<string, string[]> = {};
    for (const filter of filters) {
      const unique = [...new Set(data.map((item) => String(item[filter.field] ?? '')).filter(Boolean))].sort();
      result[filter.field] = unique;
    }
    return result;
  });

  protected readonly isFirstPage = computed(() => this.currentPage() === 1);
  protected readonly isLastPage = computed(() => this.currentPage() >= this.totalPages());
  protected readonly hasData = computed(() => this.filteredData().length > 0);
  protected readonly totalColumnsCount = computed(() => {
    const cfg = this.config();
    return cfg.columns.length + (cfg.showActions ? 1 : 0);
  });

  constructor() {
    // Sync pageSize with config when config changes
    effect(() => {
      const cfg = this.config();
      if (cfg.pageSizes?.length) {
        this.pageSize.set(cfg.pageSizes[0]);
      }
    });

    // Reset to page 1 when data changes
    effect(() => {
      this.data(); // Track data signal
      this.currentPage.set(1);
    });
  }

  // --- Actions ---
  protected onSelectFilterChange(field: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectFilterValues.update((current) => ({ ...current, [field]: target.value }));
    this.currentPage.set(1);
  }

  protected onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(1);
  }

  protected onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize.set(Number(target.value));
    this.currentPage.set(1);
  }

  protected onSort(field: string): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  protected onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  protected goToFirstPage(): void {
    this.currentPage.set(1);
  }

  protected goToLastPage(): void {
    this.currentPage.set(this.totalPages());
  }

  protected getBooleanBadgeClass(value: boolean): string {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    if (value === true) {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
    }
    return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
  }

  protected getBooleanText(value: boolean): string {
    return value === true ? 'Si' : 'No';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected trackByField(_index: number, item: any): any {
    return item;
  }
}
