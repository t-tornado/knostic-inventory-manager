import type {
  DashboardStats,
  CategoryData,
  StoreData,
  StockLevelData,
  InventoryValueData,
  LowStockAlert,
  ActivityItem,
} from "../../application/services/dashboard/types";

export interface IDashboardRepository {
  getStats(): Promise<DashboardStats>;
  getCategoryData(): Promise<CategoryData[]>;
  getStoreData(): Promise<StoreData[]>;
  getStockLevelData(days: number): Promise<StockLevelData[]>;
  getInventoryValueData(days: number): Promise<InventoryValueData[]>;
  getLowStockAlerts(limit: number): Promise<LowStockAlert[]>;
  getRecentActivity(limit: number): Promise<ActivityItem[]>;
}
