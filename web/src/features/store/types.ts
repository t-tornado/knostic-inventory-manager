import type { Store } from "@/core/models/store/model";

export interface StoreQueryParams {
  search?: string;
  filters?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface StoreQueryResult {
  data: Store[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IStoreRepository {
  getStores(params?: StoreQueryParams): Promise<StoreQueryResult>;
}

export interface IStoreService {
  getStores(params?: StoreQueryParams): Promise<StoreQueryResult>;
}
