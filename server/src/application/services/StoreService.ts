import type {
  IStoreRepository,
  StoreQueryParams,
  StoreQueryResult,
} from "../../domain/repositories/IStoreRepository";
import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import type { Store } from "../../domain/entities/Store";
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
    const storeId = createStoreId(Number(id));
    return this.storeRepository.findById(storeId);
  }

  async getStoreDetails(id: string): Promise<StoreDetails | null> {
    const storeId = createStoreId(Number(id));
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      return null;
    }

    const stats = await this.productRepository.getStoreStats(storeId);
    return {
      store,
      stats,
    };
  }

  async createStore(data: { name: string }): Promise<Store> {
    return this.storeRepository.create({
      name: data.name.trim(),
    });
  }

  async updateStore(id: string, data: { name?: string }): Promise<Store> {
    const storeId = createStoreId(Number(id));
    const updates: Partial<Omit<Store, "id" | "createdAt">> = {};
    if (data.name !== undefined) {
      updates.name = data.name.trim();
    }
    return this.storeRepository.update(storeId, updates);
  }

  async deleteStore(id: string): Promise<boolean> {
    const storeId = createStoreId(Number(id));
    return this.db.transaction(async (transactionDb) => {
      await this.productRepository.deleteByStoreId(storeId, transactionDb);
      return this.storeRepository.delete(storeId, transactionDb);
    });
  }
}
