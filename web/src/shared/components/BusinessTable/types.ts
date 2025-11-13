import type { ReactNode } from "react";

export type TableRowData = Record<string, unknown>;

export interface TableSchema {
  [source: string]: {
    [field: string]: {
      value_types: string[];
      values: string[] | number[];
      types?: string[];
    };
  };
}

export interface ParsedField {
  source: string;
  field: string;
  valueTypes: string[];
  values: (string | number)[];
  types?: string[];
  fullKey: string;
}

export interface ParsedSchema {
  fields: ParsedField[];
  sources: string[];
  fieldMap: Map<string, ParsedField>;
}

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal"
  | "in"
  | "not_in"
  | "is_null"
  | "is_not_null";

export interface Filter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | number | (string | number)[] | null;
  source?: string;
}

export interface FilterGroup {
  id: string;
  filters: Filter[];
  operator: "AND" | "OR";
}

export interface Column {
  id: string;
  field: string;
  source?: string;
  label: string;
  accessor: (row: TableRowData) => unknown;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  order?: number;
}

export interface ColumnSort {
  id: string;
  direction: "asc" | "desc";
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  total?: number;
}

export type SelectionMode = "single" | "multiple" | "none";

export interface SelectionState {
  selectedRows: Set<string | number>;
  mode: SelectionMode;
}

export interface GroupingState {
  groupBy: string[];
  expanded: Set<string>;
}

export interface TableState {
  filters: Filter[];
  filterGroups: FilterGroup[];

  columns: Column[];
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  columnSorting: ColumnSort[];

  searchKeyword: string;
  searchType: "exact" | "fuzzy";

  pagination: PaginationState;

  selection: SelectionState;

  grouping: GroupingState;
}

export type TableAction =
  | { type: "FILTER_ADD"; payload: Filter }
  | { type: "FILTER_REMOVE"; payload: string }
  | { type: "FILTER_UPDATE"; payload: { id: string; filter: Partial<Filter> } }
  | { type: "FILTER_CLEAR" }
  | { type: "FILTER_GROUP_ADD"; payload: FilterGroup }
  | { type: "FILTER_GROUP_REMOVE"; payload: string }
  | { type: "COLUMN_TOGGLE"; payload: string }
  | { type: "COLUMN_REORDER"; payload: { from: number; to: number } }
  | { type: "COLUMN_SORT"; payload: ColumnSort }
  | { type: "COLUMN_SORT_CLEAR" }
  | { type: "COLUMN_RESIZE"; payload: { id: string; width: number } }
  | { type: "SEARCH_SET"; payload: string }
  | { type: "SEARCH_TYPE_SET"; payload: "exact" | "fuzzy" }
  | { type: "PAGINATION_SET"; payload: Partial<PaginationState> }
  | { type: "SELECTION_TOGGLE"; payload: string | number }
  | { type: "SELECTION_SELECT_ALL"; payload: boolean }
  | { type: "SELECTION_CLEAR" }
  | { type: "GROUPING_SET"; payload: string[] }
  | { type: "GROUPING_TOGGLE"; payload: string }
  | { type: "STATE_RESET" }
  | { type: "STATE_RESTORE"; payload: Partial<TableState> };

export interface TableRequestParams {
  filters?: string;
  search?: string;
  searchType?: "exact" | "fuzzy";
  sort?: string;
  page?: number;
  pageSize?: number;
  groupBy?: string;
  columns?: string;
}

export interface TableResponse {
  data: unknown[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export type TableDataService = (
  params: TableRequestParams
) => Promise<TableResponse>;

export interface TableFeatures {
  enableFiltering?: boolean;
  enableSearching?: boolean;
  enableGrouping?: boolean;
  enableDynamicColumns?: boolean;
  enableBulkActions?: boolean;
  enableRowActions?: boolean;
  enableColumnSorting?: boolean;
  enablePersistStateInURL?: boolean;
  enableSavedTablePreferences?: boolean;
  enableColumnResizing?: boolean;
  enableColumnReordering?: boolean;
}

export interface TableCustomization {
  formatFieldLabel?: (field: string, source?: string) => string;
  renderCellValue?: (
    column: Column,
    rowData: TableRowData,
    setRowData?: (data: TableRowData) => void
  ) => ReactNode;
  renderColumnHeader?: (column: Column) => ReactNode;
  renderRowActions?: (rowData: TableRowData) => ReactNode;
  renderBulkActions?: (selectedRows: TableRowData[]) => ReactNode;
  formatFilterValue?: (field: string, value: unknown) => string;
  validateFilter?: (filter: Filter) => boolean | string;
}

export interface TableSlots {
  RowActions?: React.ComponentType<{ rowData: TableRowData }>;
  BulkActions?: React.ComponentType<{ selectedRows: TableRowData[] }>;
  FilterPanel?: React.ComponentType;
  ColumnPanel?: React.ComponentType;
  GroupingPanel?: React.ComponentType;
  EmptyState?: React.ComponentType;
  LoadingState?: React.ComponentType;
  ErrorState?: React.ComponentType<{ error: Error; refetch: () => void }>;
}

export interface TableConfig {
  schema: TableSchema;
  getData: TableDataService;
  features?: TableFeatures;
  customization?: TableCustomization;
  slots?: TableSlots;
  initialState?: Partial<TableState>;
  queryKeyPrefix?: string;
  persistKey?: string;
}

export interface BusinessTableProps extends TableConfig {
  className?: string;
  style?: React.CSSProperties;
  onRowClick?: (row: unknown) => void;
  onRowSelect?: (rows: TableRowData[]) => void;
  onStateChange?: (state: TableState) => void;
  onFiltersChange?: (filters: Filter[]) => void;
  getRowId?: (row: TableRowData) => string | number;
}

export interface BusinessTableHandle {
  updateRow: (rowId: string | number, updatedRow: TableRowData) => void;
  upsertRow: (rowId: string | number | undefined, row: TableRowData) => void;
  deleteRow: (rowId: string | number) => void;
}

export type RawRowId = string | number;
export type OptionalRowId = string | number | undefined;
