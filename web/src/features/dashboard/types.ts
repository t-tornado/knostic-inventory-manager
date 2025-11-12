/**
 * Dashboard data types matching the server API response structure
 */

export interface DashboardStats {
  totalStores: number;
  totalProducts: number;
  totalInventoryValue: number;
  lowStockCount: number;
}

export interface CategoryData {
  category: string;
  count: number;
}

export interface StoreData {
  storeId: string;
  storeName: string;
  productCount: number;
  inventoryValue: number;
}

export interface StockLevelData {
  date: string;
  totalStock: number;
}

export interface InventoryValueData {
  date: string;
  totalValue: number;
}

export interface LowStockAlert {
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  category: string;
  stockQuantity: number;
}

export interface ActivityItem {
  type: "add" | "update" | "store";
  text: string;
  timestamp: string;
}

export interface DashboardData {
  stats: DashboardStats;
  categories: CategoryData[];
  stores: StoreData[];
  stockLevels: StockLevelData[];
  inventoryValue: InventoryValueData[];
  alerts: LowStockAlert[];
  activity: ActivityItem[];
}

export interface DashboardDataOptions {
  includeStats?: boolean;
  includeCategories?: boolean;
  includeStores?: boolean;
  includeStockLevels?: boolean;
  includeInventoryValue?: boolean;
  includeAlerts?: boolean;
  includeActivity?: boolean;
  stockPeriod?: "7d" | "30d" | "90d";
  valuePeriod?: "7d" | "30d" | "90d";
  alertsLimit?: number;
  activityLimit?: number;
}

export interface IDashboardRepository {
  /**
   * Get all dashboard data
   * @returns Promise resolving to the dashboard data
   */
  getDashboard(): Promise<DashboardData>;
}
export interface IDashboardService {
  getDashboard(): Promise<DashboardData>;
}
