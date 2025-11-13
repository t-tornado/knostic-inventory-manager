import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";

export function removeStoreDetailQueries(
  queryClient: QueryClient,
  storeId: string
) {
  queryClient.removeQueries({
    queryKey: queryKeys.stores.detail(storeId),
  });
  queryClient.removeQueries({
    queryKey: queryKeys.stores.detailWithStats(storeId),
  });
}
