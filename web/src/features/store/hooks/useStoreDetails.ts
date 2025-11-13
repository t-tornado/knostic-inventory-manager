import { useQuery } from "@tanstack/react-query";
import { storeService } from "../service";
import type { StoreDetails } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";

export interface UseStoreDetailsOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useStoreDetails(
  id: string,
  options: UseStoreDetailsOptions = {}
) {
  const { enabled = true, refetchInterval = false } = options;

  return useQuery<StoreDetails, Error>({
    queryKey: queryKeys.stores.detailWithStats(id),
    queryFn: () => storeService.getStoreDetails(id),
    enabled: enabled && !!id,
    refetchInterval,
    staleTime: 30000,
    gcTime: 300000,
  });
}
