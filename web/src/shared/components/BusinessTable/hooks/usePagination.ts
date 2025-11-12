import { useTableState } from "./useTableState";
import { paginationActions } from "../state/actions";

export function usePagination() {
  const { state, dispatch } = useTableState();

  const setPage = (pageIndex: number) => {
    dispatch(paginationActions.setPage(pageIndex));
  };

  const setPageSize = (pageSize: number) => {
    dispatch(paginationActions.setPageSize(pageSize));
  };

  const nextPage = () => {
    if (
      state.pagination.total &&
      state.pagination.pageIndex <
        Math.ceil(state.pagination.total / state.pagination.pageSize) - 1
    ) {
      dispatch(paginationActions.setPage(state.pagination.pageIndex + 1));
    }
  };

  const previousPage = () => {
    if (state.pagination.pageIndex > 0) {
      dispatch(paginationActions.setPage(state.pagination.pageIndex - 1));
    }
  };

  const canGoNext = () => {
    if (!state.pagination.total) return false;
    return (
      state.pagination.pageIndex <
      Math.ceil(state.pagination.total / state.pagination.pageSize) - 1
    );
  };

  const canGoPrevious = () => {
    return state.pagination.pageIndex > 0;
  };

  return {
    pagination: state.pagination,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
    // Convert 0-based to 1-based for display
    currentPage: state.pagination.pageIndex + 1,
    totalPages: state.pagination.total
      ? Math.ceil(state.pagination.total / state.pagination.pageSize)
      : 0,
  };
}
