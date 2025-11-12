import type { Product, ProductId } from "../entities/Product";
import type { StoreId } from "../entities/Store";

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

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findAllWithParams(params?: ProductQueryParams): Promise<ProductQueryResult>;
  findById(id: ProductId): Promise<Product | null>;
  findByStoreId(storeId: StoreId): Promise<Product[]>;
  findByStoreIdWithParams(
    storeId: StoreId,
    params?: ProductQueryParams
  ): Promise<ProductQueryResult>;
  create(product: Omit<Product, "createdAt" | "updatedAt">): Promise<Product>;
  update(
    id: ProductId,
    product: Partial<Omit<Product, "id" | "createdAt">>
  ): Promise<Product>;
  delete(id: ProductId): Promise<boolean>;
  deleteByStoreId(storeId: StoreId): Promise<number>;
}
