import { apiClient } from "@/infrastructure/apiClient";
import { createDashboardRepository } from "./repository";
import type { IDashboardService, IDashboardRepository } from "./types";

export function createDashboardService(
  repository: IDashboardRepository
): IDashboardService {
  return {
    async getDashboard() {
      return repository.getDashboard();
    },
  };
}

export const dashboardService = createDashboardService(
  createDashboardRepository(apiClient)
);
