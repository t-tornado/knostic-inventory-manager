import { useQuery } from "@tanstack/react-query";
import { storeService } from "../service";
import type { StoreDetails } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";

export interface UseStoreDetailsOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

/**
 * React Query hook for fetching store details with stats
 * @param id - Store ID
 * @param options - Options for React Query configuration
 * @returns React Query result with store details
 */
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
