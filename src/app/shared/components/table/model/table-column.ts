import { TableColumnType } from './table-column-type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableColumn<T = any> {
  title: string;
  field: keyof T & string;
  type: TableColumnType;
  width?: string;
  sortable?: boolean;
  percentageMode?: 'bar' | 'text';
}
