import { QueryClient, QueryFilters, Updater } from "@tanstack/react-query";
import {
  ProductQueryResult,
  ProductQueryUpdater,
  ProductQueryUpdaterFn,
} from "../types";
import { isProductsListQueryKey, isTableQueryKey } from "./queryKeyUtils";
import { TableResponse } from "@/shared/components/BusinessTable";

export function updateAllProductQueries(
  queryClient: QueryClient,
  updater: Updater<ProductQueryUpdater, ProductQueryUpdater>
) {
  queryClient.setQueriesData<ProductQueryUpdater>(
    {
      predicate: (query) => {
        return isProductsListQueryKey(query.queryKey);
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
      const result = (updater as ProductQueryUpdaterFn)?.(old);
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
