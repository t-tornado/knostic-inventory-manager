import type { Product, ProductId } from "../entities/Product";
import type { StoreId } from "../entities/Store";
import type { IDatabase } from "../../infrastructure/database";

export interface ProductQueryParams {
  search?: string | undefined;
  filters?: string | undefined;
  sort?: string | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}

export interface ProductQueryResult {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StoreStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
}

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findAllWithParams(params?: ProductQueryParams): Promise<ProductQueryResult>;
  findById(id: ProductId): Promise<Product | null>;
  findByStoreId(storeId: StoreId): Promise<Product[]>;
  findByStoreIdWithParams(
    storeId: StoreId,
    params?: ProductQueryParams
  ): Promise<ProductQueryResult>;
  create(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product>;
  update(
    id: ProductId,
    product: Partial<Omit<Product, "id" | "createdAt">>
  ): Promise<Product>;
  delete(id: ProductId): Promise<boolean>;
  deleteByStoreId(storeId: StoreId, transactionDb?: IDatabase): Promise<number>;
  getStoreStats(storeId: StoreId): Promise<StoreStats>;
}
