import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../service";
import type { ActivityItem } from "../types";
import { queryKeys } from "@/shared/config/queryKeys";

export interface UseActivitiesOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useActivities(options: UseActivitiesOptions = {}) {
  const { enabled = true, refetchInterval = false } = options;

  return useQuery<ActivityItem[], Error>({
    queryKey: queryKeys.dashboard.activities(),
    queryFn: () => dashboardService.getActivities(),
    enabled,
    refetchInterval,
  });
}
