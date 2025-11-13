import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import { useTableState } from "./useTableState";
import { encodeTableStateToParams } from "../utils/state/encoder";
import { MRT_RowData } from "material-react-table";

export function useTableData() {
  const { state, dispatch, config, getRowId } = useTableState();
  const queryClient = useQueryClient();

  const requestParams = useMemo(() => {
    return encodeTableStateToParams(state);
  }, [state]);

  const queryKey = useMemo(() => {
    const baseKey = [config.queryKeyPrefix || "table", requestParams];
    return baseKey;
  }, [config.queryKeyPrefix, requestParams]);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!config.getData) {
        throw new Error("getData service function is required");
      }

      const result = await config.getData(requestParams);

      if (result.meta?.total !== undefined) {
        dispatch({
          type: "PAGINATION_SET",
          payload: { total: result.meta.total },
        });
      }

      return result;
    },
    enabled: !!config.getData,
    staleTime: 30000,
  });

  const resolveRowId = useCallback(
    (row: MRT_RowData) => {
      if (getRowId) {
        try {
          return getRowId(row);
        } catch {
          return undefined;
        }
      }
      return (
        row?.id ?? row?._id ?? row?.uuid ?? row?.key ?? row?.slug ?? undefined
      );
    },
    [getRowId]
  );

  const updateRowById = useCallback(
    (rowId: string | number, updatedRow: MRT_RowData) => {
      if (rowId === undefined || rowId === null) return;
      queryClient.setQueryData(queryKey, (old: MRT_RowData) => {
        if (!old) return old;
        let updated = false;
        const nextData = old.data.map((row: MRT_RowData) => {
          if (resolveRowId(row) === rowId) {
            updated = true;
            return { ...updatedRow };
          }
          return row;
        });
        if (!updated) {
          return old;
        }
        return {
          ...old,
          data: nextData,
        };
      });
    },
    [queryClient, queryKey, resolveRowId]
  );

  const upsertRowById = useCallback(
    (rowId: string | number | undefined, newRow: MRT_RowData) => {
      const resolvedId = rowId ?? resolveRowId(newRow);
      if (resolvedId === undefined || resolvedId === null) return;

      queryClient.setQueryData(queryKey, (old: MRT_RowData) => {
        if (!old) return old;

        let found = false;
        const nextData = old.data.map((row: MRT_RowData) => {
          if (resolveRowId(row) === resolvedId) {
            found = true;
            return { ...newRow };
          }
          return row;
        });

        if (!found) {
          nextData.unshift({ ...newRow });
        }

        const nextMeta = {
          ...old.meta,
          total: found
            ? old.meta?.total ?? nextData.length
            : (old.meta?.total ?? old.data.length) + 1,
        };

        dispatch({
          type: "PAGINATION_SET",
          payload: { total: nextMeta.total },
        });

        return {
          ...old,
          data: nextData,
          meta: nextMeta,
        };
      });
    },
    [dispatch, queryClient, queryKey, resolveRowId]
  );

  const deleteRowById = useCallback(
    (rowId: string | number) => {
      if (rowId === undefined || rowId === null) return;
      queryClient.setQueryData(queryKey, (old: MRT_RowData) => {
        if (!old) return old;
        const nextData = old.data.filter(
          (row: MRT_RowData) => resolveRowId(row) !== rowId
        );
        if (nextData.length === old.data.length) {
          return old;
        }
        const nextMeta = {
          ...old.meta,
          total: Math.max(0, (old.meta?.total ?? old.data.length) - 1),
        };
        dispatch({
          type: "PAGINATION_SET",
          payload: { total: nextMeta.total },
        });
        return {
          ...old,
          data: nextData,
          meta: nextMeta,
        };
      });
    },
    [dispatch, queryClient, queryKey, resolveRowId]
  );

  return {
    data: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateRowById,
    upsertRowById,
    deleteRowById,
  };
}
