import type { TableState, TableRequestParams } from "../../types";

/**
 * Encodes table state into request parameters
 */
export function encodeTableStateToParams(
  state: TableState
): TableRequestParams {
  const params: TableRequestParams = {};

  // Add filters (strip frontend-specific fields like id and source)
  if (state.filters.length > 0) {
    const apiFilters = state.filters.map((filter) => ({
      field: filter.field,
      operator: filter.operator,
      value: filter.value,
    }));
    params.filters = JSON.stringify(apiFilters);
  }

  // Add search
  if (state.searchKeyword) {
    params.search = state.searchKeyword;
    params.searchType = state.searchType;
  }

  // Add sorting
  if (state.columnSorting.length > 0) {
    params.sort = JSON.stringify(state.columnSorting);
  }

  // Add pagination (convert to 1-based)
  params.page = state.pagination.pageIndex + 1;
  params.pageSize = state.pagination.pageSize;

  // Add grouping
  if (state.grouping.groupBy.length > 0) {
    params.groupBy = JSON.stringify(state.grouping.groupBy);
  }

  // Add column visibility
  const visibleColumns = Object.keys(state.columnVisibility).filter(
    (key) => state.columnVisibility[key]
  );
  if (visibleColumns.length > 0) {
    params.columns = JSON.stringify(visibleColumns);
  }

  return params;
}

/**
 * Encodes table state into URLSearchParams for URL usage
 */
export function encodeTableStateToURLParams(
  state: TableState
): URLSearchParams {
  const params = new URLSearchParams();
  const encoded = encodeTableStateToParams(state);

  if (encoded.filters) {
    params.append("filters", encoded.filters);
  }
  if (encoded.search) {
    params.append("search", encoded.search);
    if (encoded.searchType) {
      params.append("searchType", encoded.searchType);
    }
  }
  if (encoded.sort) {
    params.append("sort", encoded.sort);
  }
  if (encoded.page) {
    params.append("page", String(encoded.page));
  }
  if (encoded.pageSize) {
    params.append("pageSize", String(encoded.pageSize));
  }
  if (encoded.groupBy) {
    params.append("groupBy", encoded.groupBy);
  }
  if (encoded.columns) {
    params.append("columns", encoded.columns);
  }

  return params;
}
