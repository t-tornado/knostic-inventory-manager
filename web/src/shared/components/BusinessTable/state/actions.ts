import type {
  TableAction,
  Filter,
  FilterGroup,
  ColumnSort,
  PaginationState,
  TableState,
} from "../types";

// ============================================================================
// Filter Actions
// ============================================================================

export const filterActions = {
  add: (filter: Filter): TableAction => ({
    type: "FILTER_ADD",
    payload: filter,
  }),

  remove: (id: string): TableAction => ({
    type: "FILTER_REMOVE",
    payload: id,
  }),

  update: (id: string, filter: Partial<Filter>): TableAction => ({
    type: "FILTER_UPDATE",
    payload: { id, filter },
  }),

  clear: (): TableAction => ({
    type: "FILTER_CLEAR",
  }),

  addGroup: (group: FilterGroup): TableAction => ({
    type: "FILTER_GROUP_ADD",
    payload: group,
  }),

  removeGroup: (id: string): TableAction => ({
    type: "FILTER_GROUP_REMOVE",
    payload: id,
  }),
};

// ============================================================================
// Column Actions
// ============================================================================

export const columnActions = {
  toggle: (id: string): TableAction => ({
    type: "COLUMN_TOGGLE",
    payload: id,
  }),

  reorder: (from: number, to: number): TableAction => ({
    type: "COLUMN_REORDER",
    payload: { from, to },
  }),

  sort: (sort: ColumnSort): TableAction => ({
    type: "COLUMN_SORT",
    payload: sort,
  }),

  clearSort: (): TableAction => ({
    type: "COLUMN_SORT_CLEAR",
  }),

  resize: (id: string, width: number): TableAction => ({
    type: "COLUMN_RESIZE",
    payload: { id, width },
  }),
};

// ============================================================================
// Search Actions
// ============================================================================

export const searchActions = {
  set: (keyword: string): TableAction => ({
    type: "SEARCH_SET",
    payload: keyword,
  }),

  setType: (type: "exact" | "fuzzy"): TableAction => ({
    type: "SEARCH_TYPE_SET",
    payload: type,
  }),
};

// ============================================================================
// Pagination Actions
// ============================================================================

export const paginationActions = {
  set: (pagination: Partial<PaginationState>): TableAction => ({
    type: "PAGINATION_SET",
    payload: pagination,
  }),

  setPage: (pageIndex: number): TableAction => ({
    type: "PAGINATION_SET",
    payload: { pageIndex },
  }),

  setPageSize: (pageSize: number): TableAction => ({
    type: "PAGINATION_SET",
    payload: { pageSize, pageIndex: 0 }, // Reset to first page
  }),
};

// ============================================================================
// Selection Actions
// ============================================================================

export const selectionActions = {
  toggle: (id: string | number): TableAction => ({
    type: "SELECTION_TOGGLE",
    payload: id,
  }),

  selectAll: (select: boolean): TableAction => ({
    type: "SELECTION_SELECT_ALL",
    payload: select,
  }),

  clear: (): TableAction => ({
    type: "SELECTION_CLEAR",
  }),
};

// ============================================================================
// Grouping Actions
// ============================================================================

export const groupingActions = {
  set: (fields: string[]): TableAction => ({
    type: "GROUPING_SET",
    payload: fields,
  }),

  toggle: (key: string): TableAction => ({
    type: "GROUPING_TOGGLE",
    payload: key,
  }),
};

// ============================================================================
// State Management Actions
// ============================================================================

export const stateActions = {
  reset: (): TableAction => ({
    type: "STATE_RESET",
  }),

  restore: (state: Partial<TableState>): TableAction => ({
    type: "STATE_RESTORE",
    payload: state,
  }),
};
