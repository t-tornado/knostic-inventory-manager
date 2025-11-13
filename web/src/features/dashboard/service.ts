import type { BaseApiClient } from "@/infrastructure/apiClient/base";
import { apiClient } from "@/infrastructure/apiClient";
import type { IDashboardService, DashboardData } from "./types";
import { ApiResponse } from "@/shared/api";

export function createDashboardService(
  apiClient: BaseApiClient
): IDashboardService {
  return {
    async getDashboard(): Promise<DashboardData> {
      const url = "/dashboard";
      const response = await apiClient.get<ApiResponse<DashboardData>>(url);
      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to fetch dashboard data"
        );
      }

      if (!response.data) {
        throw new Error("No data returned from dashboard API");
      }

      return response.data;
    },
  };
}

export const dashboardService = createDashboardService(apiClient);
