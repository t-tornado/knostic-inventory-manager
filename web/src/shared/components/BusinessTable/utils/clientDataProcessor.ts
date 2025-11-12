import type { TableState, Column } from "../types";

/**
 * Processes data client-side based on table state
 */
export function processClientData(
  state: TableState,
  data: any[]
): {
  data: any[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
} {
  let processed = [...data];

  // Apply filters
  if (state.filters.length > 0) {
    processed = applyFilters(processed, state.filters, state.columns);
  }

  // Apply search
  if (state.searchKeyword) {
    processed = applySearch(
      processed,
      state.searchKeyword,
      state.searchType,
      state.columns
    );
  }

  // Apply sorting
  if (state.columnSorting.length > 0) {
    processed = applySorting(processed, state.columnSorting, state.columns);
  }

  // Apply grouping
  if (state.grouping.groupBy.length > 0) {
    processed = applyGrouping(processed, state.grouping, state.columns);
  }

  // Calculate total before pagination
  const total = processed.length;

  // Apply pagination
  const start = state.pagination.pageIndex * state.pagination.pageSize;
  const end = start + state.pagination.pageSize;
  processed = processed.slice(start, end);

  return {
    data: processed,
    meta: {
      total,
      page: state.pagination.pageIndex + 1, // Convert to 1-based
      pageSize: state.pagination.pageSize,
    },
  };
}

function applyFilters(data: any[], filters: any[], columns: Column[]): any[] {
  return data.filter((row) => {
    return filters.every((filter) => {
      const column = columns.find(
        (c) => c.id === filter.field || c.field === filter.field
      );
      if (!column) return true;

      const value = column.accessor(row);
      return evaluateFilter(value, filter);
    });
  });
}

function evaluateFilter(value: any, filter: any): boolean {
  switch (filter.operator) {
    case "equals":
      return value === filter.value;
    case "not_equals":
      return value !== filter.value;
    case "contains":
      return String(value)
        .toLowerCase()
        .includes(String(filter.value).toLowerCase());
    case "not_contains":
      return !String(value)
        .toLowerCase()
        .includes(String(filter.value).toLowerCase());
    case "starts_with":
      return String(value)
        .toLowerCase()
        .startsWith(String(filter.value).toLowerCase());
    case "ends_with":
      return String(value)
        .toLowerCase()
        .endsWith(String(filter.value).toLowerCase());
    case "greater_than":
      return Number(value) > Number(filter.value);
    case "less_than":
      return Number(value) < Number(filter.value);
    case "greater_than_or_equal":
      return Number(value) >= Number(filter.value);
    case "less_than_or_equal":
      return Number(value) <= Number(filter.value);
    case "in":
      return Array.isArray(filter.value) && filter.value.includes(value);
    case "not_in":
      return Array.isArray(filter.value) && !filter.value.includes(value);
    case "is_null":
      return value === null || value === undefined || value === "";
    case "is_not_null":
      return value !== null && value !== undefined && value !== "";
    default:
      return true;
  }
}

function applySearch(
  data: any[],
  keyword: string,
  type: string,
  columns: Column[]
): any[] {
  const searchTerm = keyword.toLowerCase();
  return data.filter((row) => {
    return columns.some((col) => {
      const value = col.accessor(row);
      const stringValue = String(value || "").toLowerCase();

      if (type === "exact") {
        return stringValue === searchTerm;
      } else {
        return stringValue.includes(searchTerm);
      }
    });
  });
}

function applySorting(data: any[], sorting: any[], columns: Column[]): any[] {
  return [...data].sort((a, b) => {
    for (const sort of sorting) {
      const column = columns.find((c) => c.id === sort.id);
      if (!column) continue;

      const aValue = column.accessor(a);
      const bValue = column.accessor(b);

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      if (comparison !== 0) {
        return sort.direction === "asc" ? comparison : -comparison;
      }
    }
    return 0;
  });
}

function applyGrouping(data: any[], grouping: any, columns: Column[]): any[] {
  // Grouping logic would be implemented here
  // For now, return data as-is
  return data;
}
