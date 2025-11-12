import { apiClient } from "@/infrastructure/apiClient";
import { createDashboardRepository } from "./repository";
import type { IDashboardService, IDashboardRepository } from "./types";

/**
 * Factory function to create a dashboard service
 */
export function createDashboardService(
  repository: IDashboardRepository
): IDashboardService {
  return {
    async getDashboard() {
      return repository.getDashboard();
    },
  };
}

/**
 * Singleton dashboard service instance
 * Use this instance in hooks and components
 */
export const dashboardService = createDashboardService(
  createDashboardRepository(apiClient)
);
