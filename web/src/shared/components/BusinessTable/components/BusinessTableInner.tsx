import { useEffect, useRef, useImperativeHandle } from "react";
import { useTableData, useTableState } from "../hooks";
import { Box } from "@mui/material";
import type { Filter, BusinessTableHandle } from "../types";
import { TableControls, Table, TablePagination } from "./index";
import { haveFiltersChanged } from "../utils/filterComparison";

interface BusinessTableInnerProps {
  onFiltersChange?: (filters: Filter[]) => void;
  tableRef?: React.Ref<BusinessTableHandle>;
}

export function BusinessTableInner({
  onFiltersChange,
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
