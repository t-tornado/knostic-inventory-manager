import { useQuery } from "@tanstack/react-query";
import { storeService } from "../service";
import type { ProductQueryParams, ProductQueryResult } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";

export interface UseStoreProductsOptions extends ProductQueryParams {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useStoreProducts(
  storeId: string,
  options: UseStoreProductsOptions = {}
) {
  const {
    enabled = true,
    refetchInterval = false,
    search,
    filters,
    sort,
    page,
    pageSize,
  } = options;

  const queryParams: ProductQueryParams = {
    search,
    filters,
    sort,
    page,
    pageSize,
  };

  return useQuery<ProductQueryResult, Error>({
    queryKey: queryKeys.products.byStoreWithParams(storeId, queryParams),
    queryFn: () => storeService.getStoreProducts(storeId, queryParams),
    enabled: enabled && !!storeId,
    refetchInterval,
    staleTime: 30000,
    gcTime: 300000,
  });
}
