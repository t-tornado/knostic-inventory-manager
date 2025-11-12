import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useColumns } from "../hooks/useColumns";
import { useTableState } from "../hooks";
import { columnActions, paginationActions } from "../state/actions";
import { transformColumnsToMRT } from "../utils/mrt/columnTransform";
import {
  transformSortingToMRT,
  transformSortingFromMRT,
  transformPaginationToMRT,
  transformPaginationFromMRT,
} from "../utils/mrt/stateSync";
import type {
  MRT_SortingState,
  MRT_PaginationState,
} from "material-react-table";

interface TableProps {
  data: any[];
  isLoading: boolean;
}

export function Table({ data, isLoading }: TableProps) {
  const { visibleColumns, columnSorting } = useColumns();
  const { state, dispatch, config, getRowId } = useTableState();

  // Transform columns to MRT format
  const mrtColumns = useMemo<MRT_ColumnDef<any>[]>(() => {
    return transformColumnsToMRT(visibleColumns);
  }, [visibleColumns]);

  // Transform sorting state
  const mrtSorting = useMemo<MRT_SortingState>(() => {
    return transformSortingToMRT(columnSorting);
  }, [columnSorting]);

  // Transform pagination state
  const mrtPagination = useMemo<MRT_PaginationState>(() => {
    return transformPaginationToMRT(state.pagination);
  }, [state.pagination]);

  // Handle sorting changes from MRT
  const handleSortingChange = (
    updater: MRT_SortingState | ((old: MRT_SortingState) => MRT_SortingState)
  ) => {
    const newSorting =
      typeof updater === "function" ? updater(mrtSorting) : updater;
    const businessTableSorting = transformSortingFromMRT(newSorting);

    // Update our state
    if (businessTableSorting.length === 0) {
      dispatch(columnActions.clearSort());
    } else {
      // Apply the first sort (MRT supports multi-sort, but we'll use the first one)
      const firstSort = businessTableSorting[0];
      dispatch(
        columnActions.sort({ id: firstSort.id, direction: firstSort.direction })
      );
    }
  };

  // Handle pagination changes from MRT
  const handlePaginationChange = (
    updater:
      | MRT_PaginationState
      | ((old: MRT_PaginationState) => MRT_PaginationState)
  ) => {
    const newPagination =
      typeof updater === "function" ? updater(mrtPagination) : updater;
    const businessTablePagination = transformPaginationFromMRT(
      newPagination,
      state.pagination.total
    );

    // Update our state
    dispatch(paginationActions.setPage(businessTablePagination.pageIndex));
    dispatch(paginationActions.setPageSize(businessTablePagination.pageSize));
  };

  // Configure MRT table
  const table = useMaterialReactTable({
    columns: mrtColumns,
    data: data,
    getRowId: getRowId
      ? (row) => {
          // MRT passes the row data directly, not wrapped in an object
          if (!row) return String(Math.random());
          try {
            return String(getRowId(row));
          } catch {
            // Fallback if getRowId fails
            return String((row as any)?.id ?? Math.random());
          }
        }
      : undefined,
    enableColumnOrdering: config.features.enableColumnReordering !== false,
    enableSorting: config.features.enableColumnSorting !== false,
    enableColumnFilters: false, // We use custom filtering
    enableGlobalFilter: false, // We use custom search
    enablePagination: false, // We handle pagination separately
    enableRowSelection: false, // Row selection can be controlled via onRowSelect callback
    manualSorting: true, // We handle sorting in our state
    manualPagination: true, // We handle pagination in our state
    enableTopToolbar: false,
    enableColumnDragging: false,
    enableColumnResizing: false,
    state: {
      sorting: mrtSorting,
      pagination: mrtPagination,
      isLoading,
      showProgressBars: isLoading,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,

    muiTableContainerProps: {
      sx: {
        maxHeight: "100%",
      },
    },
    muiTablePaperProps: {
      variant: "outlined",
      sx: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
    },
    muiTableProps: {
      size: "small",
      stickyHeader: true,
    },
    layoutMode: "grid", // Use grid layout for better column sizing
    defaultColumn: {
      minSize: 80,
      maxSize: 500,
      size: 150,
    },
  });

  return <MaterialReactTable table={table} />;
}
