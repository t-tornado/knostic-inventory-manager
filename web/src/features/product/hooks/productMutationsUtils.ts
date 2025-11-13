import type { QueryClient, QueryFilters } from "@tanstack/react-query";
import type { ProductQueryResult } from "../types";
import type { TableResponse } from "@/shared/components/BusinessTable/types";
import {
  isProductsListQueryKey,
  isTableQueryKey,
} from "../utils/queryKeyUtils";

export function updateAllProductQueries(
  queryClient: QueryClient,
  updater: (
    old: ProductQueryResult | TableResponse | undefined
  ) => ProductQueryResult | TableResponse | undefined
) {
  queryClient.setQueriesData<ProductQueryResult>(
    {
      predicate: (query) => {
        const key = query.queryKey;
        return Array.isArray(key) && key[0] === "products" && key[1] === "list";
      },
    } as QueryFilters,
    updater as (
      old: ProductQueryResult | undefined
    ) => ProductQueryResult | undefined
  );

  queryClient.setQueriesData<TableResponse>(
    {
      predicate: (query) => {
        const key = query.queryKey;
        return (
          Array.isArray(key) &&
          (key[0] === "table" || key[0] === "products") &&
          typeof key[1] === "object" &&
          key[1] !== null
        );
      },
    } as QueryFilters,
    (old) => {
      const result = updater(old);
      if (!result) return old;

      if ("meta" in result) {
        return result as TableResponse;
      }

      const productResult = result as ProductQueryResult;
      return {
        data: productResult.data,
        meta: {
          total: productResult.total,
          page: productResult.page,
          pageSize: productResult.pageSize,
        },
      };
    }
  );
}

export function getPreviousProductQueries(
  queryClient: QueryClient
): Map<string, ProductQueryResult | TableResponse | undefined> {
  const previous = new Map<
    string,
    ProductQueryResult | TableResponse | undefined
  >();

  queryClient
    .getQueriesData<ProductQueryResult>({
      predicate: (query) => {
        return isProductsListQueryKey(query.queryKey);
      },
    } as QueryFilters)
    .forEach(([queryKey, data]) => {
      previous.set(JSON.stringify(queryKey), data);
    });

  queryClient
    .getQueriesData<TableResponse>({
      predicate: (query) => {
        return isTableQueryKey(query.queryKey);
      },
    } as QueryFilters)
    .forEach(([queryKey, data]) => {
      previous.set(JSON.stringify(queryKey), data);
    });

  return previous;
}

export function restorePreviousProductQueries(
  queryClient: QueryClient,
  previous: Map<string, ProductQueryResult | TableResponse | undefined>
) {
  previous.forEach((data, keyStr) => {
    const queryKey = JSON.parse(keyStr);
    queryClient.setQueryData(queryKey, data);
  });
}
