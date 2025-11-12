import { useEffect, useRef } from "react";
import { TableProvider } from "../context";
import { useTableData, useTableState } from "../hooks";
import { Box } from "@mui/material";
import type { BusinessTableProps, Filter } from "../types";
import { TableControls, Table, TablePagination } from "./index";

interface BusinessTableInnerProps {
  onFiltersChange?: (filters: Filter[]) => void;
}

function BusinessTableInner({ onFiltersChange }: BusinessTableInnerProps) {
  const { data, meta, isLoading, error } = useTableData();
  const { state } = useTableState();
  const previousFiltersRef = useRef<Filter[]>(state.filters);

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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TableControls />
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Table data={data} isLoading={isLoading} />
      </Box>
      <TablePagination meta={meta} />
    </Box>
  );
}

export function BusinessTable(props: BusinessTableProps) {
  const { onFiltersChange, getRowId, ...config } = props;

  return (
    <TableProvider config={config} getRowId={getRowId}>
      <BusinessTableInner onFiltersChange={onFiltersChange} />
    </TableProvider>
  );
}
