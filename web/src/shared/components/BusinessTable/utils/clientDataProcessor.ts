import type { TableState } from "../types";

/**
 * Processes data client-side based on table state
 * Returns empty shell - implementation removed
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
  // Return empty shell - no data processing
  void data;
  return {
    data: [],
    meta: {
      total: 0,
      page: state.pagination.pageIndex + 1,
      pageSize: state.pagination.pageSize,
    },
  };
}
