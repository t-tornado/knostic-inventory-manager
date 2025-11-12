import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../service";
import type { DashboardData } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";

export interface UseDashboardOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

/**
 * React Query hook for fetching dashboard data
 * Uses the singleton dashboardService instance by default
 * @param options - Options for React Query configuration
 * @returns React Query result with dashboard data
 */
export function useDashboard(options: UseDashboardOptions = {}) {
  const { enabled = true, refetchInterval = false } = options;

  return useQuery<DashboardData, Error>({
    queryKey: queryKeys.dashboard.allData(),
    queryFn: () => dashboardService.getDashboard(),
    enabled,
    refetchInterval,
    staleTime: 30000,
    gcTime: 300000,
  });
}
