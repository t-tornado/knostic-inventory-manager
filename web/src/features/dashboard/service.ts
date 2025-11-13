import { apiClient as defaultClient } from "@/infrastructure/apiClient";
import type { IApiClient } from "@/infrastructure/apiClient";
import { getRequest } from "@/infrastructure/apiClient/requestHelpers";
import type { IDashboardService, DashboardData, ActivityItem } from "./types";

export const createDashboardService = (
  client: IApiClient = defaultClient
): IDashboardService => ({
  async getDashboard(): Promise<DashboardData> {
    const url = "/dashboard";
    return getRequest<DashboardData>(
      client,
      url,
      "No data returned from dashboard API"
    );
  },
  async getActivities(): Promise<ActivityItem[]> {
    const url = "/dashboard/activity";
    return getRequest<ActivityItem[]>(
      client,
      url,
      "No data returned from activities API"
    );
  },
});

export const dashboardService = createDashboardService();
