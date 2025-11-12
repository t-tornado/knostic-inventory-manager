import { apiClient } from "@/infrastructure/apiClient";
import { createStoreRepository } from "./repository";
import type {
  IStoreService,
  IStoreRepository,
  StoreQueryParams,
  ProductQueryParams,
} from "./types";

export function createStoreService(
  repository: IStoreRepository
): IStoreService {
  return {
    async getStores(params?: StoreQueryParams) {
      return repository.getStores(params);
    },
    async getStoreDetails(id: string) {
      return repository.getStoreDetails(id);
    },
    async getStoreProducts(storeId: string, params?: ProductQueryParams) {
      return repository.getStoreProducts(storeId, params);
    },
  };
}

export const storeService = createStoreService(
  createStoreRepository(apiClient)
);
