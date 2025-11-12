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
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IProductRepository {
  getProducts(params?: ProductQueryParams): Promise<ProductQueryResult>;
  getProductById(id: string): Promise<Product>;
  createProduct(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product>;
  updateProduct(
    id: string,
    product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
  ): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}

export interface IProductService {
  getProducts(params?: ProductQueryParams): Promise<ProductQueryResult>;
  getProductById(id: string): Promise<Product>;
  createProduct(data: {
    storeId: string;
    name: string;
    category: string;
    stockQuantity: number;
    price: number;
  }): Promise<Product>;
  updateProduct(
    id: string,
    data: {
      storeId?: string;
      name?: string;
      category?: string;
      stockQuantity?: number;
      price?: number;
    }
  ): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}
