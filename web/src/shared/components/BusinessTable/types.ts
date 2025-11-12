import type { ReactNode } from "react";

// ============================================================================
// Schema Types
// ============================================================================

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
  fullKey: string; // "source.field"
}

export interface ParsedSchema {
  fields: ParsedField[];
  sources: string[];
  fieldMap: Map<string, ParsedField>;
}

// ============================================================================
// Filter Types
// ============================================================================

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
  field: string; // Field key from schema (e.g., "source.field" or just "field")
  operator: FilterOperator;
  value: string | number | (string | number)[] | null;
  source?: string; // Optional source if field is scoped to a source
}

export interface FilterGroup {
  id: string;
  filters: Filter[];
  operator: "AND" | "OR";
}

// ============================================================================
// Column Types
// ============================================================================

export interface Column {
  id: string;
  field: string;
  source?: string;
  label: string;
  accessor: (row: any) => any;
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

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationState {
  pageIndex: number; // 0-based
  pageSize: number;
  total?: number;
}

// ============================================================================
// Selection Types
// ============================================================================

export type SelectionMode = "single" | "multiple" | "none";

export interface SelectionState {
  selectedRows: Set<string | number>;
  mode: SelectionMode;
}

// ============================================================================
// Grouping Types
// ============================================================================

export interface GroupingState {
  groupBy: string[];
  expanded: Set<string>;
}

// ============================================================================
// Table State
// ============================================================================

export interface TableState {
  // Filters
  filters: Filter[];
  filterGroups: FilterGroup[];

  // Columns
  columns: Column[];
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  columnSorting: ColumnSort[];

  // Search
  searchKeyword: string;
  searchType: "exact" | "fuzzy";

  // Pagination
  pagination: PaginationState;

  // Selection
  selection: SelectionState;

  // Grouping
  grouping: GroupingState;
}

// ============================================================================
// Action Types
// ============================================================================

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

// ============================================================================
// Service Types
// ============================================================================

export interface TableRequestParams {
  filters?: string; // JSON stringified
  search?: string;
  searchType?: "exact" | "fuzzy";
  sort?: string; // JSON stringified
  page?: number; // 1-based
  pageSize?: number;
  groupBy?: string; // JSON stringified
  columns?: string; // JSON stringified
}

export interface TableResponse {
  data: any[];
  meta: {
    total: number;
    page: number; // 1-based
    pageSize: number;
  };
}

/**
 * Service function that receives encoded table state and returns data
 * The table manages the request lifecycle (loading, error, etc.)
 */
export type TableDataService = (
  params: TableRequestParams
) => Promise<TableResponse>;

export type ProcessingMode = "server" | "client";

// ============================================================================
// Configuration Types
// ============================================================================

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
    rowData: any,
    setRowData?: (data: any) => void
  ) => ReactNode;
  renderColumnHeader?: (column: Column) => ReactNode;
  renderRowActions?: (rowData: any) => ReactNode;
  renderBulkActions?: (selectedRows: any[]) => ReactNode;
  formatFilterValue?: (field: string, value: any) => string;
  validateFilter?: (filter: Filter) => boolean | string;
}

export interface TableSlots {
  RowActions?: React.ComponentType<{ rowData: any }>;
  BulkActions?: React.ComponentType<{ selectedRows: any[] }>;
  FilterPanel?: React.ComponentType;
  ColumnPanel?: React.ComponentType;
  GroupingPanel?: React.ComponentType;
  EmptyState?: React.ComponentType;
  LoadingState?: React.ComponentType;
  ErrorState?: React.ComponentType<{ error: Error; refetch: () => void }>;
}

export interface TableConfig {
  schema: TableSchema;
  getData?: TableDataService; // Service function for server mode
  processingMode: ProcessingMode;
  data?: any[]; // for client mode - will be processed locally
  features?: TableFeatures;
  customization?: TableCustomization;
  slots?: TableSlots;
  initialState?: Partial<TableState>;
  queryKeyPrefix?: string;
  persistKey?: string; // localStorage key
}

// ============================================================================
// Component Props
// ============================================================================

export interface BusinessTableProps extends TableConfig {
  className?: string;
  style?: React.CSSProperties;
  onRowClick?: (row: any) => void;
  onRowSelect?: (rows: any[]) => void;
  onStateChange?: (state: TableState) => void;
  onFiltersChange?: (filters: Filter[]) => void;
  /**
   * Function to get a unique ID for each row.
   * If not provided, MRT will use the row index.
   * This is useful for maintaining row identity when data updates.
   */
  getRowId?: (row: any) => string | number;
}

export interface BusinessTableHandle {
  updateRow: (rowId: string | number, updatedRow: any) => void;
  upsertRow: (rowId: string | number | undefined, row: any) => void;
  deleteRow: (rowId: string | number) => void;
}
