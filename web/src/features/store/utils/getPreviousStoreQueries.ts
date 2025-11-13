import { QueryClient } from "@tanstack/react-query";
import { StoreQueryResult, StoreQueryUpdaterMap } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";
import { isStoresListQueryKey, isTableQueryKey } from "./queryKeyUtils";

export function getPreviousStoreQueries(
  queryClient: QueryClient
): StoreQueryUpdaterMap {
  const previous: StoreQueryUpdaterMap = new Map();

  queryClient
    .getQueriesData<StoreQueryResult>({
      predicate: (query) => {
        return isStoresListQueryKey(query.queryKey);
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
