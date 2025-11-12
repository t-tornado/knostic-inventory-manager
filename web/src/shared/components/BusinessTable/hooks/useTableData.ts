import { useQuery } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { useTableState } from "./useTableState";
import { loadingActions, errorActions } from "../state";
import { encodeTableStateToParams } from "../utils/state/encoder";
import { processClientData } from "../utils/clientDataProcessor";

export function useTableData() {
  const { state, dispatch, config } = useTableState();

  // Encode table state into request parameters
  const requestParams = useMemo(() => {
    return encodeTableStateToParams(state);
  }, [state]);

  // Build query key based on request params (not full state for better caching)
  const queryKey = useMemo(() => {
    const baseKey = [config.queryKeyPrefix || "table", requestParams];
    return baseKey;
  }, [config.queryKeyPrefix, requestParams]);

  // Fetch data using the getData service function
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (config.processingMode === "server") {
        if (!config.getData) {
          throw new Error(
            "getData service function is required for server mode"
          );
        }

        // Dispatch loading state
        dispatch(loadingActions.set(true));

        try {
          // Call the getData service with encoded params
          const result = await config.getData(requestParams);

          // Update pagination total from response
          if (result.meta?.total !== undefined) {
            dispatch({
              type: "PAGINATION_SET",
              payload: { total: result.meta.total },
            });
          }

          dispatch(loadingActions.set(false));
          return result;
        } catch (error) {
          dispatch(loadingActions.set(false));
          dispatch(errorActions.set(error as Error));
          throw error;
        }
      } else {
        // Client-side processing - process data locally
        if (!config.data) {
          throw new Error("Data is required for client mode");
        }
        return processClientData(state, config.data);
      }
    },
    enabled:
      (config.processingMode === "server" && !!config.getData) ||
      (config.processingMode === "client" && !!config.data),
    staleTime: 30000, // 30 seconds
  });

  // Sync loading state
  useEffect(() => {
    if (query.isLoading !== state.isLoading) {
      dispatch(loadingActions.set(query.isLoading));
    }
  }, [query.isLoading, state.isLoading, dispatch]);

  // Sync error state
  useEffect(() => {
    if (query.error && !state.error) {
      dispatch(errorActions.set(query.error as Error));
    }
  }, [query.error, state.error, dispatch]);

  return {
    data: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
