import type {
  IStoreRepository,
  StoreQueryParams,
  StoreQueryResult,
} from "../../domain/repositories/IStoreRepository";
import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import type { Store, StoreId } from "../../domain/entities/Store";
import { createStoreId } from "../../domain/entities/Store";

export class StoreService {
  constructor(
    private storeRepository: IStoreRepository,
    private productRepository: IProductRepository
  ) {}

  async getAllStores(params?: StoreQueryParams): Promise<StoreQueryResult> {
    return this.storeRepository.findAll(params);
  }

  async getStoreById(id: string): Promise<Store | null> {
    const storeId = createStoreId(id);
    return this.storeRepository.findById(storeId);
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
