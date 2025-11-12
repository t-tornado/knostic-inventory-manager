import { useQuery } from "@tanstack/react-query";
import { productService } from "../service";
import type { ProductQueryParams, ProductQueryResult } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";

export interface UseProductsOptions extends ProductQueryParams {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useProducts(options: UseProductsOptions = {}) {
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
    queryKey: queryKeys.products.list(queryParams),
    queryFn: () => productService.getProducts(queryParams),
    enabled,
    refetchInterval,
    staleTime: 30000,
    gcTime: 300000,
  });
}
