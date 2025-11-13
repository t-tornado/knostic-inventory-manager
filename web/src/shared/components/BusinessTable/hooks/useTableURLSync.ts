import { useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { TableState } from "../types";
import { encodeTableStateToURLParams } from "../utils/state/encoder";
import { decodeURLParamsToTableState } from "../utils/state/decoder";

interface UseTableURLSyncOptions {
  enabled?: boolean;
}

interface UseTableURLSyncResult {
  initialState: Partial<TableState>;
  handleStateChange: (state: TableState) => void;
}

export function useTableURLSync(
  options: UseTableURLSyncOptions = {}
): UseTableURLSyncResult {
  const { enabled = false } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const previousStateRef = useRef<{
    filters: string;
    search: string;
    page: number;
    pageSize: number;
    sort: string;
    columns: string;
  } | null>(null);
  const initialSearchParamsRef = useRef<URLSearchParams | null>(null);
  const isInitializedRef = useRef(false);

  if (initialSearchParamsRef.current === null) {
    initialSearchParamsRef.current = new URLSearchParams(searchParams);
  }

  const initialState = useMemo(() => {
    if (!enabled || !initialSearchParamsRef.current) {
      return {};
    }
    const decodedState = decodeURLParamsToTableState(
      initialSearchParamsRef.current
    );

    // Initialize previousStateRef from URL to prevent immediate update on mount
    if (!isInitializedRef.current && initialSearchParamsRef.current) {
      const urlParams = initialSearchParamsRef.current;
      const sortString = urlParams.get("sort") || "[]";
      const columnsString = urlParams.get("columns") || "[]";
      const filtersString = urlParams.get("filters") || "[]";
      const searchString = urlParams.get("search") || "";
      const page = urlParams.get("page")
        ? parseInt(urlParams.get("page")!, 10)
        : 1;
      const pageSize = urlParams.get("pageSize")
        ? parseInt(urlParams.get("pageSize")!, 10)
        : 10;

      previousStateRef.current = {
        filters: filtersString,
        search: searchString,
        page,
        pageSize,
        sort: sortString,
        columns: columnsString,
      };
      isInitializedRef.current = true;
    }

    return decodedState;
  }, [enabled]);

  const handleStateChange = useCallback(
    (state: TableState) => {
      if (!enabled) {
        return;
      }

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
        const urlParams = encodeTableStateToURLParams(state);
        setSearchParams(urlParams, { replace: true });
        previousStateRef.current = currentState;
      }
    },
    [enabled, setSearchParams]
  );

  return {
    initialState,
    handleStateChange,
  };
}
