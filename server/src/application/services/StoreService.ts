import type {
  IStoreRepository,
  StoreQueryParams,
  StoreQueryResult,
} from "../../domain/repositories/IStoreRepository";
import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import type { Store, StoreId } from "../../domain/entities/Store";
import { createStoreId } from "../../domain/entities/Store";
import type { IDatabase } from "../../infrastructure/database";

export interface StoreDetails {
  store: Store;
  stats: {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
  };
}

export class StoreService {
  constructor(
    private storeRepository: IStoreRepository,
    private productRepository: IProductRepository,
    private db: IDatabase
  ) {}

  async getAllStores(params?: StoreQueryParams): Promise<StoreQueryResult> {
    return this.storeRepository.findAll(params);
  }

  async getStoreById(id: string): Promise<Store | null> {
    const storeId = createStoreId(id);
    return this.storeRepository.findById(storeId);
  }

  async getStoreDetails(id: string): Promise<StoreDetails | null> {
    const storeId = createStoreId(id);
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      return null;
    }

    // Get stats in a single query
    const result = await this.db.query<{
      total_products: number;
      total_value: number;
      low_stock_count: number;
    }>(
      `SELECT 
        (SELECT COUNT(*) FROM products WHERE store_id = ?) as total_products,
        (SELECT COALESCE(SUM(price * stock_quantity), 0) FROM products WHERE store_id = ?) as total_value,
        (SELECT COUNT(*) FROM products WHERE store_id = ? AND stock_quantity < 10) as low_stock_count`,
      [storeId, storeId, storeId]
    );

    const row = result[0];
    return {
      store,
      stats: {
        totalProducts: row?.total_products ?? 0,
        totalValue: Math.round((row?.total_value ?? 0) * 100) / 100,
        lowStockItems: row?.low_stock_count ?? 0,
      },
    };
  }

  async createStore(data: { name: string }): Promise<Store> {
    const id = createStoreId(`STR-${Date.now()}`);
    return this.storeRepository.create({
      id,
      name: data.name.trim(),
    });
  }

  async updateStore(id: string, data: { name?: string }): Promise<Store> {
    const storeId = createStoreId(id);
    const updates: Partial<Omit<Store, "id" | "createdAt">> = {};
    if (data.name !== undefined) {
      updates.name = data.name.trim();
    }
    return this.storeRepository.update(storeId, updates);
  }

  async deleteStore(id: string): Promise<boolean> {
    const storeId = createStoreId(id);
    // Delete associated products first (handled by CASCADE in DB, but explicit for clarity)
    await this.productRepository.deleteByStoreId(storeId);
    return this.storeRepository.delete(storeId);
  }
}
