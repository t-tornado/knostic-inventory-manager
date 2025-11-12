import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { TableProvider } from "../context";
import { useTableData, useTableState } from "../hooks";
import { Box } from "@mui/material";
import type { BusinessTableProps, Filter, BusinessTableHandle } from "../types";
import { TableControls, Table, TablePagination } from "./index";

interface BusinessTableInnerProps {
  onFiltersChange?: (filters: Filter[]) => void;
  tableRef?: React.Ref<BusinessTableHandle>;
}

function BusinessTableInner({
  onFiltersChange,
  tableRef,
}: BusinessTableInnerProps) {
  const {
    data,
    meta,
    isLoading,
    error,
    updateRowById,
    upsertRowById,
    deleteRowById,
  } = useTableData();
  const { state } = useTableState();
  const previousFiltersRef = useRef<Filter[]>(state.filters);

  useImperativeHandle(
    tableRef,
    () => ({
      updateRow: updateRowById,
      upsertRow: upsertRowById,
      deleteRow: deleteRowById,
    }),
    [updateRowById, upsertRowById, deleteRowById]
  );

  // Subscribe to filter changes
  useEffect(() => {
    if (onFiltersChange) {
      const currentFilters = state.filters;
      const previousFilters = previousFiltersRef.current;

      // Check if filters actually changed
      const filtersChanged =
        currentFilters.length !== previousFilters.length ||
        currentFilters.some((filter, index) => {
          const prevFilter = previousFilters[index];
          if (!prevFilter) return true;

          // Compare filter properties
          return (
            filter.id !== prevFilter.id ||
            filter.field !== prevFilter.field ||
            filter.operator !== prevFilter.operator ||
            filter.source !== prevFilter.source ||
            // Deep compare values (handles arrays, objects, primitives)
            JSON.stringify(filter.value) !== JSON.stringify(prevFilter.value)
          );
        });

      if (filtersChanged) {
        onFiltersChange([...currentFilters]); // Pass a copy to avoid mutations
        previousFiltersRef.current = [...currentFilters];
      }
    }
  }, [state.filters, onFiltersChange]);

  if (error) {
    return (
      <Box p={3}>
        <div>Error loading data: {error.message}</div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 400,
        bgcolor: "background.paper",
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        boxShadow: 1,
        overflow: "hidden",
      }}
    >
      <TableControls />
      <Box sx={{ flex: 1, overflow: "auto", minHeight: 0, p: 2 }}>
        <Table data={data} isLoading={isLoading} />
      </Box>
      <TablePagination meta={meta} />
    </Box>
  );
}

export const BusinessTable = forwardRef<
  BusinessTableHandle,
  BusinessTableProps
>((props, ref) => {
  const { onFiltersChange, getRowId, onRowClick, ...config } = props;

  return (
    <TableProvider config={config} getRowId={getRowId} onRowClick={onRowClick}>
      <BusinessTableInner onFiltersChange={onFiltersChange} tableRef={ref} />
    </TableProvider>
  );
});

BusinessTable.displayName = "BusinessTable";
