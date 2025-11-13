import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../service";
import type { DashboardData } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";

export interface UseDashboardOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const { enabled = true, refetchInterval = false } = options;

  return useQuery<DashboardData, Error>({
    queryKey: queryKeys.dashboard.allData(),
    queryFn: () => dashboardService.getDashboard(),
    enabled,
    refetchInterval,
  });
}
