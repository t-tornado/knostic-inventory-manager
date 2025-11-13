import { apiClient as defaultClient } from "@/infrastructure/apiClient";
import type { IApiClient } from "@/infrastructure/apiClient";
import { getRequest } from "@/infrastructure/apiClient/requestHelpers";
import type { IDashboardService, DashboardData, ActivityItem } from "./types";

/**
 *
 * @description Service layer for the dashboard.
 *  use the router helpers to simplify interaction with the api client.
 * 
 *  We could have implemented an abstracted data source which will deal directly with the API client but this is here to 
 * make things simple at first. If we are refactoring, lets add that data source abstraction so that we can swap out the API clients and 
 * data easily.

 */
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
