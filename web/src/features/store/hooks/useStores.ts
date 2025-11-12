import { useQuery } from "@tanstack/react-query";
import { storeService } from "../service";
import type { StoreQueryParams, StoreQueryResult } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";

export interface UseStoresOptions extends StoreQueryParams {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useStores(options: UseStoresOptions = {}) {
  const {
    enabled = true,
    refetchInterval = false,
    search,
    filters,
    sort,
    page,
    pageSize,
  } = options;

  const queryParams: StoreQueryParams = {
    search,
    filters,
    sort,
    page,
    pageSize,
  };

  return useQuery<StoreQueryResult, Error>({
    queryKey: queryKeys.stores.list(queryParams),
    queryFn: () => storeService.getStores(queryParams),
    enabled,
    refetchInterval,
    staleTime: 30000,
    gcTime: 300000,
  });
}
