import type { Store, StoreId } from "../entities/Store";
import type { IDatabase } from "../../infrastructure/database";

export interface StoreQueryParams {
  search?: string | undefined;
  filters?: string | undefined; // JSON string of filters
  sort?: string | undefined; // JSON string of sort array
  page?: number | undefined;
  pageSize?: number | undefined;
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
  delete(id: StoreId, transactionDb?: IDatabase): Promise<boolean>;
}
