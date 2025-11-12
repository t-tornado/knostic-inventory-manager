import type { ColumnSort, PaginationState } from "../../types";
import type {
  MRT_SortingState,
  MRT_PaginationState,
} from "material-react-table";

/**
 * Transforms BusinessTable sorting state to MRT sorting state
 */
export function transformSortingToMRT(
  columnSorting: ColumnSort[]
): MRT_SortingState {
  return columnSorting.map((sort) => ({
    id: sort.id,
    desc: sort.direction === "desc",
  }));
}

/**
 * Transforms MRT sorting state to BusinessTable sorting state
 */
export function transformSortingFromMRT(
  mrtSorting: MRT_SortingState
): ColumnSort[] {
  return mrtSorting.map((sort) => ({
    id: sort.id,
    direction: sort.desc ? "desc" : "asc",
  }));
}

/**
 * Transforms BusinessTable pagination state to MRT pagination state
 */
export function transformPaginationToMRT(
  pagination: PaginationState
): MRT_PaginationState {
  return {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  };
}

/**
 * Transforms MRT pagination state to BusinessTable pagination state
 */
export function transformPaginationFromMRT(
  mrtPagination: MRT_PaginationState,
  total?: number
): PaginationState {
  return {
    pageIndex: mrtPagination.pageIndex,
    pageSize: mrtPagination.pageSize,
    total,
  };
}
