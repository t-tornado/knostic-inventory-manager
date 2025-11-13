import type { Store, StoreId } from "../entities/Store";

export interface StoreQueryParams {
  search?: string;
  filters?: string; // JSON string of filters
  sort?: string; // JSON string of sort array
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
  findAll(params?: StoreQueryParams): Promise<StoreQueryResult>;
  findById(id: StoreId): Promise<Store | null>;
  create(store: Omit<Store, "id" | "createdAt" | "updatedAt">): Promise<Store>;
  update(
    id: StoreId,
    store: Partial<Omit<Store, "id" | "createdAt">>
  ): Promise<Store>;
  delete(id: StoreId): Promise<boolean>;
}
