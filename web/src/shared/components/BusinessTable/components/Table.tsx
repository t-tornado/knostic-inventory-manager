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
  MRT_RowData,
} from "material-react-table";
import { TableErrorFallback } from "./TableErrorFallback";
import { TableEmptyFallback } from "./TableEmptyFallback";

interface TableProps {
  data: unknown[];
  isLoading: boolean;
  error?: Error | null;
  refetch?: () => void;
}

export function Table({ data, isLoading, error, refetch }: TableProps) {
  const { visibleColumns, columnSorting } = useColumns();
  const { state, dispatch, config, getRowId, onRowClick } = useTableState();

  const mrtColumns = useMemo<MRT_ColumnDef<MRT_RowData>[]>(() => {
    return transformColumnsToMRT(visibleColumns, config.customization);
  }, [visibleColumns, config.customization]);

  const mrtSorting = useMemo<MRT_SortingState>(() => {
    return transformSortingToMRT(columnSorting);
  }, [columnSorting]);

  const mrtPagination = useMemo<MRT_PaginationState>(() => {
    return transformPaginationToMRT(state.pagination);
  }, [state.pagination]);

  const handleSortingChange = (
    updater: MRT_SortingState | ((old: MRT_SortingState) => MRT_SortingState)
  ) => {
    const newSorting =
      typeof updater === "function" ? updater(mrtSorting) : updater;
    const businessTableSorting = transformSortingFromMRT(newSorting);

    if (businessTableSorting.length === 0) {
      dispatch(columnActions.clearSort());
    } else {
      const firstSort = businessTableSorting[0];
      dispatch(
        columnActions.sort({ id: firstSort.id, direction: firstSort.direction })
      );
    }
  };

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

    dispatch(paginationActions.setPage(businessTablePagination.pageIndex));
    dispatch(paginationActions.setPageSize(businessTablePagination.pageSize));
  };

  const table = useMaterialReactTable({
    columns: mrtColumns,
    data: data as MRT_RowData[],
    getRowId: getRowId
      ? (row) => {
          if (!row) return String(Math.random());
          try {
            return String(getRowId(row));
          } catch {
            return String(row?.id ?? Math.random());
          }
        }
      : undefined,
    enableColumnOrdering: false,
    enableSorting: config.features.enableColumnSorting !== false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enablePagination: false,
    enableRowSelection: false,
    manualSorting: true,
    manualPagination: true,
    enableTopToolbar: false,
    enableColumnDragging: false,
    enableColumnResizing: false,
    enableColumnActions: false,
    enableStickyHeader: true,
    state: {
      sorting: mrtSorting,
      pagination: mrtPagination,
      isLoading,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,

    muiTableContainerProps: {
      sx: {
        height: "100%",
        maxHeight: "100%",
        position: "relative",
        overflow: "auto",
        "& .MuiTable-root": {
          position: "relative",
        },
        "& .MuiTableHead-root": {
          "& ~ *": {
            position: "relative",
            zIndex: 1,
          },
        },
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        height: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "none",
        position: "relative",
        overflow: "hidden",
        "& .MuiBox-root": {
          backgroundColor: "background.default",
        },
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
      },
    },
    muiTableProps: {
      size: "small",
      stickyHeader: true,
      sx: {
        "& .MuiTableBody-root": {
          bgcolor: "background.paper",
          position: "relative",
        },
        "& .MuiTableCell-body": {
          bgcolor: "background.paper",
        },
        "& .MuiTableCell-head": {
          bgcolor: "background.default",
          position: "sticky",
          top: 0,
          zIndex: 10,
        },
        "& .MuiTableHead-root": {
          position: "sticky",
          top: 0,
          zIndex: 20,
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: "bold",
        bgcolor: "action.hover",
        position: "sticky",
        top: 0,
        zIndex: 20,
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: onRowClick
        ? () => {
            onRowClick(row.original);
          }
        : undefined,
      sx: {
        cursor: onRowClick ? "pointer" : "default",
        bgcolor: "background.paper",
        "&:hover": onRowClick
          ? {
              backgroundColor: (theme) =>
                theme.palette.mode === theme.palette.background.default,
            }
          : {},
      },
    }),
    layoutMode: "grid",
    defaultColumn: {
      minSize: 80,
      maxSize: 500,
      size: 150,
    },
    renderEmptyRowsFallback: () => {
      if (error && data.length === 0) {
        return <TableErrorFallback error={error} refetch={refetch} />;
      }
      if (!error && data.length === 0 && !isLoading) {
        return <TableEmptyFallback />;
      }
      return null;
    },
  });

  return <MaterialReactTable table={table} />;
}
