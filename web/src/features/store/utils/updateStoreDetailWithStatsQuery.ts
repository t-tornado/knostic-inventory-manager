import { QueryClient } from "@tanstack/react-query";
import type { StoreDetails } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";
import { nowISO } from "@/shared/utils/date";

export function updateStoreDetailWithStatsQuery(
  queryClient: QueryClient,
  storeId: string,
  updatePayload: { name: string }
) {
  const previousDetailWithStats = queryClient.getQueryData<StoreDetails>(
    queryKeys.stores.detailWithStats(storeId)
  );

  if (previousDetailWithStats) {
    queryClient.setQueryData(queryKeys.stores.detailWithStats(storeId), {
      ...previousDetailWithStats,
      store: {
        ...previousDetailWithStats.store,
        ...updatePayload,
        updatedAt: nowISO(),
      },
    });
  }
}
