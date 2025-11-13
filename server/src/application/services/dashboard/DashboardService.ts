import type { IDashboardRepository } from "../../../domain/repositories/IDashboardRepository";
import type {
  DashboardStats,
  CategoryData,
  StoreData,
  StockLevelData,
  InventoryValueData,
  LowStockAlert,
  ActivityItem,
  DashboardData,
} from "./types";

export class DashboardService {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async getAllDashboardData(): Promise<DashboardData> {
    const [
      stats,
      categories,
      stores,
      stockLevels,
      inventoryValue,
      alerts,
      activity,
    ] = await Promise.all([
      this.dashboardRepository.getStats(),
      this.dashboardRepository.getCategoryData(),
      this.dashboardRepository.getStoreData(),
      this.dashboardRepository.getStockLevelData(7),
      this.dashboardRepository.getInventoryValueData(7),
      this.dashboardRepository.getLowStockAlerts(10),
      this.dashboardRepository.getRecentActivity(10),
    ]);

    return {
      stats,
      categories,
      stores,
      stockLevels,
      inventoryValue,
      alerts,
      activity,
    };
  }

  async getRecentActivity(): Promise<ActivityItem[]> {
    return this.dashboardRepository.getRecentActivity(10);
  }

  async getStats(): Promise<DashboardStats> {
    return this.dashboardRepository.getStats();
  }

  async getCategoryData(): Promise<CategoryData[]> {
    return this.dashboardRepository.getCategoryData();
  }

  async getStoreData(): Promise<StoreData[]> {
    return this.dashboardRepository.getStoreData();
  }

  async getStockLevelData(): Promise<StockLevelData[]> {
    return this.dashboardRepository.getStockLevelData(7);
  }

  async getInventoryValueData(): Promise<InventoryValueData[]> {
    return this.dashboardRepository.getInventoryValueData(7);
  }

  async getLowStockAlerts(): Promise<LowStockAlert[]> {
    return this.dashboardRepository.getLowStockAlerts(10);
  }
}
