import { QueryClient, QueryFilters, Updater } from "@tanstack/react-query";
import {
  StoreQueryResult,
  StoreQueryUpdater,
  StoreQueryUpdaterFn,
} from "../types";
import { isStoresListQueryKey, isTableQueryKey } from "./queryKeyUtils";
import { TableResponse } from "@/shared/components/BusinessTable";

export function updateAllStoreQueries(
  queryClient: QueryClient,
  updater: Updater<StoreQueryUpdater, StoreQueryUpdater>
) {
  queryClient.setQueriesData<StoreQueryUpdater>(
    {
      predicate: (query) => {
        return isStoresListQueryKey(query.queryKey);
      },
    },
    updater
  );

  queryClient.setQueriesData<TableResponse>(
    {
      predicate: (query) => {
        return isTableQueryKey(query.queryKey);
      },
    } as QueryFilters,
    (old) => {
      const result = (updater as StoreQueryUpdaterFn)?.(old);
      if (!result) return old;

      if ("meta" in result) {
        return result as TableResponse;
      }
      const storeResult = result as StoreQueryResult;
      return {
        data: storeResult.data,
        meta: {
          total: storeResult.total,
          page: storeResult.page,
          pageSize: storeResult.pageSize,
        },
      };
    }
  );
}
