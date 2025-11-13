import { QueryClient } from "@tanstack/react-query";
import type { StoreDetails } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";

export function restoreStoreDetailWithStatsQuery(
  queryClient: QueryClient,
  storeId: string,
  previousDetailWithStats: StoreDetails | undefined
) {
  if (previousDetailWithStats) {
    queryClient.setQueryData(
      queryKeys.stores.detailWithStats(storeId),
      previousDetailWithStats
    );
  }
}
