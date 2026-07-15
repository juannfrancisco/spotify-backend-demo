import { TableColumn } from './table-column';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SelectFilter<T = any> {
  field: keyof T & string;
  label: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  textSize?: 'xs' | 'sm' | 'md' | 'lg';
  pageSizes?: number[];
  showActions?: boolean;
  showSearch?: boolean;
  showAddButton?: boolean;
  showViewDetail?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  linkViewDetail?: string;
  nameKey?: string;
  selectFilters?: SelectFilter<T>[];
}
