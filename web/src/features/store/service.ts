import { apiClient } from "@/infrastructure/apiClient";
import { createStoreRepository } from "./repository";
import type {
  IStoreService,
  IStoreRepository,
  StoreQueryParams,
} from "./types";

export function createStoreService(
  repository: IStoreRepository
): IStoreService {
  return {
    async getStores(params?: StoreQueryParams) {
      return repository.getStores(params);
    },
  };
}

export const storeService = createStoreService(
  createStoreRepository(apiClient)
);
