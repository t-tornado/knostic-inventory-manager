import { useMemo } from "react";
import { useTableState } from "./useTableState";
import { columnActions } from "../state/actions";
import { selectors } from "../state/selectors";
import type { Column, ColumnSort } from "../types";

export function useColumns() {
  const { state, dispatch } = useTableState();

  const toggleColumn = (id: string) => {
    dispatch(columnActions.toggle(id));
  };

  const reorderColumns = (from: number, to: number) => {
    dispatch(columnActions.reorder(from, to));
  };

  const sortColumn = (id: string, direction: "asc" | "desc") => {
    dispatch(columnActions.sort({ id, direction }));
  };

  const clearSorting = () => {
    dispatch(columnActions.clearSort());
  };

  const resizeColumn = (id: string, width: number) => {
    dispatch(columnActions.resize(id, width));
  };

  const visibleColumns = useMemo(
    () => selectors.visibleColumns(state),
    [state]
  );

  const getColumn = (id: string): Column | undefined => {
    return state.columns.find((col) => col.id === id);
  };

  const isColumnVisible = (id: string): boolean => {
    return state.columnVisibility[id] !== false;
  };

  const getColumnSort = (id: string): ColumnSort | undefined => {
    return state.columnSorting.find((sort) => sort.id === id);
  };

  return {
    columns: state.columns,
    visibleColumns,
    columnSorting: state.columnSorting,
    toggleColumn,
    reorderColumns,
    sortColumn,
    clearSorting,
    resizeColumn,
    getColumn,
    isColumnVisible,
    getColumnSort,
  };
}
