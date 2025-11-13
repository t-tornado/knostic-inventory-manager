import { QueryClient } from "@tanstack/react-query";
import type { Store } from "@/core/models/store/model";
import { queryKeys } from "@/shared/config/queryKeys";

export function updateStoreDetailQuery(queryClient: QueryClient, store: Store) {
  queryClient.setQueryData(queryKeys.stores.detail(store.id), store);
}
