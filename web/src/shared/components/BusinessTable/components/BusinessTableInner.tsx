import { useEffect, useRef, useImperativeHandle } from "react";
import { useTableData, useTableState } from "../hooks";
import { Box } from "@mui/material";
import type { Filter, BusinessTableHandle, TableState } from "../types";
import { TableControls, Table, TablePagination } from "./index";
import { haveFiltersChanged } from "../utils/filterComparison";

interface BusinessTableInnerProps {
  onFiltersChange?: (filters: Filter[]) => void;
  onStateChange?: (state: TableState) => void;
  tableRef?: React.Ref<BusinessTableHandle>;
}

export function BusinessTableInner({
  onFiltersChange,
  onStateChange,
  tableRef,
}: BusinessTableInnerProps) {
  const {
    data,
    meta,
    isLoading,
    error,
    refetch,
    updateRowById,
    upsertRowById,
    deleteRowById,
  } = useTableData();
  const { state } = useTableState();
  const previousFiltersRef = useRef<Filter[]>(state.filters);
  const previousStateRef = useRef<{
    filters: string;
    search: string;
    page: number;
    pageSize: number;
    sort: string;
    columns: string;
  } | null>(null);

  useImperativeHandle(
    tableRef,
    () => ({
      updateRow: updateRowById,
      upsertRow: upsertRowById,
      deleteRow: deleteRowById,
    }),
    [updateRowById, upsertRowById, deleteRowById]
  );

  useEffect(() => {
    if (onFiltersChange) {
      const currentFilters = state.filters;
      const previousFilters = previousFiltersRef.current;

      if (haveFiltersChanged(currentFilters, previousFilters)) {
        onFiltersChange([...currentFilters]);
        previousFiltersRef.current = [...currentFilters];
      }
    }
  }, [state.filters, onFiltersChange]);

  // Watch for state changes (filters, search, pagination, sorting, column visibility) and call onStateChange
  useEffect(() => {
    if (onStateChange) {
      const sortString = JSON.stringify(state.columnSorting);
      const visibleColumns = Object.keys(state.columnVisibility).filter(
        (key) => state.columnVisibility[key]
      );
      const columnsString = JSON.stringify(visibleColumns.sort());

      const currentState = {
        filters: JSON.stringify(
          state.filters.map((f) => ({
            field: f.field,
            operator: f.operator,
            value: f.value,
          }))
        ),
        search: state.searchKeyword || "",
        page: state.pagination.pageIndex + 1,
        pageSize: state.pagination.pageSize,
        sort: sortString,
        columns: columnsString,
      };

      const hasChanged =
        !previousStateRef.current ||
        previousStateRef.current.filters !== currentState.filters ||
        previousStateRef.current.search !== currentState.search ||
        previousStateRef.current.page !== currentState.page ||
        previousStateRef.current.pageSize !== currentState.pageSize ||
        previousStateRef.current.sort !== currentState.sort ||
        previousStateRef.current.columns !== currentState.columns;

      if (hasChanged) {
        onStateChange(state);
        previousStateRef.current = currentState;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.filters,
    state.searchKeyword,
    state.pagination.pageIndex,
    state.pagination.pageSize,
    state.columnSorting,
    state.columnVisibility,
    onStateChange,
  ]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        bgcolor: "background.paper",
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        boxShadow: 1,
        overflow: "hidden",
      }}
    >
      <TableControls />
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          minHeight: 0,
          p: 2,
          position: "relative",
          "& .MuiBackdrop-root": {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            pointerEvents: "none",
          },
          "& .MuiCircularProgress-root": {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 6,
            pointerEvents: "auto",
          },
        }}
      >
        <Table
          data={data}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
        />
      </Box>
      <TablePagination meta={meta} />
    </Box>
  );
}
