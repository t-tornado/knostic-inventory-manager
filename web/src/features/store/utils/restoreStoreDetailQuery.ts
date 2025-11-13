import { QueryClient } from "@tanstack/react-query";
import type { Store } from "@/core/models/store/model";
import { queryKeys } from "@/shared/config/queryKeys";

export function restoreStoreDetailQuery(
  queryClient: QueryClient,
  storeId: string,
  previousDetail: Store | undefined
) {
  if (previousDetail) {
    queryClient.setQueryData(queryKeys.stores.detail(storeId), previousDetail);
  }
}
