import type {
  Product,
  ProductWithStoreName,
} from "@/core/models/product/model";
import { TableResponse } from "@/shared/components/BusinessTable";

export interface ProductQueryParams {
  search?: string;
  filters?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductQueryResult {
  data: ProductWithStoreName[];
  total: number;
  page: number;
  pageSize: number;
}

export type RawProductType = Omit<Product, "id" | "createdAt" | "updatedAt">;

export interface IProductService {
  getProducts(params?: ProductQueryParams): Promise<ProductQueryResult>;
  getProductById(id: string): Promise<Product>;
  createProduct(data: RawProductType): Promise<Product>;
  updateProduct(id: string, data: Partial<RawProductType>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}

export type ProductQueryUpdater =
  | ProductQueryResult
  | TableResponse
  | undefined;

export type ProductQueryUpdaterFn = (
  input: ProductQueryUpdater
) => ProductQueryUpdater;

export type QueryClientStorageKey = string;
export type QueryClientStorageValue = ProductQueryUpdater;
export type ProductQueryUpdaterMap = Map<
  QueryClientStorageKey,
  QueryClientStorageValue
>;
