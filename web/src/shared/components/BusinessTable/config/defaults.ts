import type { TableFeatures, TableState, SelectionMode } from "../types";

export const defaultFeatures: Required<TableFeatures> = {
  enableFiltering: true,
  enableSearching: true,
  enableGrouping: false,
  enableDynamicColumns: true,
  enableBulkActions: false,
  enableRowActions: false,
  enableColumnSorting: true,
  enablePersistStateInURL: false,
  enableSavedTablePreferences: false,
  enableColumnResizing: false,
  enableColumnReordering: false,
};

export const defaultTableState: TableState = {
  filters: [],
  filterGroups: [],
  columns: [],
  columnOrder: [],
  columnVisibility: {},
  columnSorting: [],
  searchKeyword: "",
  searchType: "fuzzy",
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  selection: {
    selectedRows: new Set(),
    mode: "none",
  },
  grouping: {
    groupBy: [],
    expanded: new Set(),
  },
};

export const defaultPageSizes = [10, 25, 50, 100];

export const defaultSelectionMode: SelectionMode = "none";
