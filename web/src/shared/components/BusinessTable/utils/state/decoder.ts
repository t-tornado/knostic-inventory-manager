import type { TableState, Filter, ColumnSort } from "../../types";
import { defaultTableState } from "../../config/defaults";

/**
 * Decodes URLSearchParams back to table state
 */
export function decodeURLParamsToTableState(
  searchParams: URLSearchParams
): Partial<TableState> {
  const state: Partial<TableState> = {};

  // Decode filters
  const filtersParam = searchParams.get("filters");
  if (filtersParam) {
    try {
      const apiFilters = JSON.parse(filtersParam) as Array<{
        field: string;
        operator: string;
        value: string | number | (string | number)[] | null;
      }>;
      // Add IDs to filters (required by Filter type)
      state.filters = apiFilters.map((filter, index) => ({
        id: `filter-${index}-${Date.now()}`,
        field: filter.field,
        operator: filter.operator as Filter["operator"],
        value: filter.value,
      }));
    } catch (error) {
      console.warn("Failed to parse filters from URL:", error);
    }
  }

  // Decode search
  const searchParam = searchParams.get("search");
  if (searchParam) {
    state.searchKeyword = searchParam;
    const searchTypeParam = searchParams.get("searchType");
    state.searchType =
      (searchTypeParam as "exact" | "fuzzy") || defaultTableState.searchType;
  }

  // Decode sorting
  const sortParam = searchParams.get("sort");
  if (sortParam) {
    try {
      state.columnSorting = JSON.parse(sortParam) as ColumnSort[];
    } catch (error) {
      console.warn("Failed to parse sort from URL:", error);
    }
  }

  // Decode pagination
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  if (pageParam || pageSizeParam) {
    state.pagination = {
      ...defaultTableState.pagination,
      pageIndex: pageParam ? Math.max(0, parseInt(pageParam, 10) - 1) : 0, // Convert to 0-based
      pageSize: pageSizeParam
        ? parseInt(pageSizeParam, 10)
        : defaultTableState.pagination.pageSize,
    };
  }

  // Decode grouping
  const groupByParam = searchParams.get("groupBy");
  if (groupByParam) {
    try {
      const groupBy = JSON.parse(groupByParam) as string[];
      state.grouping = {
        ...defaultTableState.grouping,
        groupBy,
      };
    } catch (error) {
      console.warn("Failed to parse groupBy from URL:", error);
    }
  }

  // Decode column visibility
  const columnsParam = searchParams.get("columns");
  if (columnsParam) {
    try {
      const visibleColumns = JSON.parse(columnsParam) as string[];
      // Store visible columns as a Set for easy lookup
      // The actual columnVisibility object will be built in TableProvider
      // by merging with the full column list
      state.columnVisibility = visibleColumns.reduce((acc, colId) => {
        acc[colId] = true;
        return acc;
      }, {} as Record<string, boolean>);
    } catch (error) {
      console.warn("Failed to parse columns from URL:", error);
    }
  }

  return state;
}
