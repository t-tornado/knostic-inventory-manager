import type { BaseApiClient } from "@/infrastructure/apiClient/base";
import { apiClient } from "@/infrastructure/apiClient";
import { getRequest } from "@/infrastructure/apiClient/requestHelpers";
import type { IDashboardService, DashboardData, ActivityItem } from "./types";

export function createDashboardService(
  apiClient: BaseApiClient
): IDashboardService {
  return {
    async getDashboard(): Promise<DashboardData> {
      const url = "/dashboard";
      return getRequest<DashboardData>(
        apiClient,
        url,
        "No data returned from dashboard API"
      );
    },
    async getActivities(): Promise<ActivityItem[]> {
      const url = "/dashboard/activity";
      return getRequest<ActivityItem[]>(
        apiClient,
        url,
        "No data returned from activities API"
      );
    },
  };
}

export const dashboardService = createDashboardService(apiClient);
