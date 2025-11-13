import { QueryClient } from "@tanstack/react-query";
import { ProductQueryResult, ProductQueryUpdaterMap } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";
import { isProductsListQueryKey, isTableQueryKey } from "./queryKeyUtils";

export function getPreviousProductQueries(
  queryClient: QueryClient
): ProductQueryUpdaterMap {
  const previous: ProductQueryUpdaterMap = new Map();

  queryClient
    .getQueriesData<ProductQueryResult>({
      predicate: (query) => {
        return isProductsListQueryKey(query.queryKey);
      },
    })
    .forEach(([queryKey, data]) => {
      previous.set(JSON.stringify(queryKey), data);
    });

  queryClient
    .getQueriesData<TableResponse>({
      predicate: (query) => {
        return isTableQueryKey(query.queryKey);
      },
    })
    .forEach(([queryKey, data]) => {
      previous.set(JSON.stringify(queryKey), data);
    });

  return previous;
}
