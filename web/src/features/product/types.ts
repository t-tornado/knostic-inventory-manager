import type { Product } from "@/core/models/product/model";

export interface ProductWithStoreName extends Product {
  storeName?: string;
}

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
