import type { Store } from "@/core/models/store/model";
import type { Product } from "@/core/models/product/model";
import type { TableResponse } from "@/shared/components/BusinessTable/types";

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

export interface StoreDetails {
  store: Store;
  stats: {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
  };
}

export interface ProductQueryParams {
  search?: string;
  filters?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductQueryResult {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IStoreService {
  getStores(params?: StoreQueryParams): Promise<StoreQueryResult>;
  getStoreDetails(id: string): Promise<StoreDetails>;
  getStoreProducts(
    storeId: string,
    params?: ProductQueryParams
  ): Promise<ProductQueryResult>;
  createStore(data: { name: string }): Promise<Store>;
  updateStore(id: string, data: { name: string }): Promise<Store>;
  deleteStore(id: string): Promise<void>;
}

export type StoreQueryUpdater = StoreQueryResult | TableResponse | undefined;

export type StoreQueryUpdaterFn = (
  input: StoreQueryUpdater
) => StoreQueryUpdater;

export type QueryClientStorageKey = string;
export type QueryClientStorageValue = StoreQueryUpdater;
export type StoreQueryUpdaterMap = Map<
  QueryClientStorageKey,
  QueryClientStorageValue
>;
