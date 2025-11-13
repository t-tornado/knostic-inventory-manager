import type { IDashboardRepository } from "../../domain/repositories/IDashboardRepository";
import type {
  DashboardStats,
  CategoryData,
  StoreData,
  StockLevelData,
  InventoryValueData,
  LowStockAlert,
  ActivityItem,
} from "../../application/services/dashboard/types";
import type { IDatabase } from "../../infrastructure/database";

export class DashboardRepository implements IDashboardRepository {
  constructor(private db: IDatabase) {}

  async getStats(): Promise<DashboardStats> {
    const result = await this.db.query<{
      total_stores: number;
      total_products: number;
      total_inventory_value: number;
      low_stock_count: number;
    }>(
      `SELECT 
        (SELECT COUNT(*) FROM stores) as total_stores,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COALESCE(SUM(price * stock_quantity), 0) FROM products) as total_inventory_value,
        (SELECT COUNT(*) FROM products WHERE stock_quantity < 10) as low_stock_count`
    );

    const row = result[0];
    return {
      totalStores: row?.total_stores ?? 0,
      totalProducts: row?.total_products ?? 0,
      totalInventoryValue:
        Math.round((row?.total_inventory_value ?? 0) * 100) / 100,
      lowStockCount: row?.low_stock_count ?? 0,
    };
  }

  async getCategoryData(): Promise<CategoryData[]> {
    const result = await this.db.query<{ category: string; count: number }>(
      `SELECT category, COUNT(*) as count 
       FROM products 
       GROUP BY category 
       ORDER BY count DESC`
    );
    return result;
  }

  async getStoreData(): Promise<StoreData[]> {
    const result = await this.db.query<{
      store_id: string;
      store_name: string;
      product_count: number;
      inventory_value: number;
    }>(
      `SELECT 
        s.id as store_id,
        s.name as store_name,
        COUNT(p.id) as product_count,
        COALESCE(SUM(p.price * p.stock_quantity), 0) as inventory_value
       FROM stores s
       LEFT JOIN products p ON s.id = p.store_id
       GROUP BY s.id, s.name
       ORDER BY product_count DESC
       LIMIT 10`
    );

    return result.map((row) => ({
      storeId: row.store_id,
      storeName: row.store_name,
      productCount: row.product_count,
      inventoryValue: Math.round(row.inventory_value * 100) / 100,
    }));
  }

  async getStockLevelData(days: number): Promise<StockLevelData[]> {
    const result = await this.db.query<{ date: string; total_stock: number }>(
      `SELECT 
        date(created_at) as date,
        SUM(stock_quantity) as total_stock
       FROM products
       WHERE created_at >= datetime('now', '-' || ? || ' days')
       GROUP BY date(created_at)
       ORDER BY date ASC`,
      [days]
    );

    return result.map((row) => ({
      date: row.date,
      totalStock: row.total_stock,
    }));
  }

  async getInventoryValueData(days: number): Promise<InventoryValueData[]> {
    const result = await this.db.query<{ date: string; total_value: number }>(
      `SELECT 
        date(created_at) as date,
        SUM(price * stock_quantity) as total_value
       FROM products
       WHERE created_at >= datetime('now', '-' || ? || ' days')
       GROUP BY date(created_at)
       ORDER BY date ASC`,
      [days]
    );

    return result.map((row) => ({
      date: row.date,
      totalValue: Math.round(row.total_value * 100) / 100,
    }));
  }

  async getLowStockAlerts(limit: number): Promise<LowStockAlert[]> {
    const result = await this.db.query<{
      product_id: string;
      product_name: string;
      store_id: string;
      store_name: string;
      category: string;
      stock_quantity: number;
    }>(
      `SELECT 
        p.id as product_id,
        p.name as product_name,
        s.id as store_id,
        s.name as store_name,
        p.category,
        p.stock_quantity
       FROM products p
       INNER JOIN stores s ON p.store_id = s.id
       WHERE p.stock_quantity < 10
       ORDER BY p.stock_quantity ASC
       LIMIT ?`,
      [limit]
    );

    return result.map((row) => ({
      productId: row.product_id,
      productName: row.product_name,
      storeId: row.store_id,
      storeName: row.store_name,
      category: row.category,
      stockQuantity: row.stock_quantity,
    }));
  }

  async getRecentActivity(limit: number): Promise<ActivityItem[]> {
    const productUpdates = await this.db.query<{
      type: string;
      text: string;
      timestamp: string;
    }>(
      `SELECT 
        'update' as type,
        'Product "' || name || '" updated' as text,
        updated_at as timestamp
       FROM products
       ORDER BY updated_at DESC
       LIMIT ?`,
      [limit]
    );

    const productCreations = await this.db.query<{
      type: string;
      text: string;
      timestamp: string;
    }>(
      `SELECT 
        'add' as type,
        'New product "' || p.name || '" added to ' || s.name as text,
        p.created_at as timestamp
       FROM products p
       INNER JOIN stores s ON p.store_id = s.id
       ORDER BY p.created_at DESC
       LIMIT ?`,
      [limit]
    );

    const storeCreations = await this.db.query<{
      type: string;
      text: string;
      timestamp: string;
    }>(
      `SELECT 
        'store' as type,
        'New store "' || name || '" created' as text,
        created_at as timestamp
       FROM stores
       ORDER BY created_at DESC
       LIMIT ?`,
      [limit]
    );

    const allActivities: ActivityItem[] = [
      ...productUpdates.map((row) => ({
        type: row.type as "update",
        text: row.text,
        timestamp: row.timestamp,
      })),
      ...productCreations.map((row) => ({
        type: row.type as "add",
        text: row.text,
        timestamp: row.timestamp,
      })),
      ...storeCreations.map((row) => ({
        type: row.type as "store",
        text: row.text,
        timestamp: row.timestamp,
      })),
    ];

    return allActivities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  }
}
