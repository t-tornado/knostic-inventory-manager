import type {
  IProductRepository,
  ProductQueryParams,
  ProductQueryResult,
} from "../../domain/repositories/IProductRepository";
import type { Product, ProductId } from "../../domain/entities/Product";
import type { StoreId } from "../../domain/entities/Store";
import type { Price } from "../../domain/entities/ValueObject";
import { createProductId } from "../../domain/entities/Product";
import { createStoreId } from "../../domain/entities/Store";

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    const productId = createProductId(id);
    return this.productRepository.findById(productId);
  }

  async getProductsByStoreId(storeId: string): Promise<Product[]> {
    const id = createStoreId(storeId);
    return this.productRepository.findByStoreId(id);
  }

  async getProductsByStoreIdWithParams(
    storeId: string,
    params?: ProductQueryParams
  ): Promise<ProductQueryResult> {
    const id = createStoreId(storeId);
    return this.productRepository.findByStoreIdWithParams(id, params);
  }

  async createProduct(data: {
    storeId: string;
    name: string;
    category: string;
    stockQuantity: number;
    price: number;
  }): Promise<Product> {
    const id = createProductId(`PRD-${Date.now()}`);
    return this.productRepository.create({
      id,
      storeId: createStoreId(data.storeId),
      name: data.name.trim(),
      category: data.category.trim(),
      stockQuantity: data.stockQuantity,
      price: data.price as Price,
    });
  }

  async updateProduct(
    id: string,
    data: {
      storeId?: string;
      name?: string;
      category?: string;
      stockQuantity?: number;
      price?: number;
    }
  ): Promise<Product> {
    const productId = createProductId(id);
    const updates: Partial<Omit<Product, "id" | "createdAt">> = {};

    if (data.storeId !== undefined) {
      updates.storeId = createStoreId(data.storeId);
    }
    if (data.name !== undefined) {
      updates.name = data.name.trim();
    }
    if (data.category !== undefined) {
      updates.category = data.category.trim();
    }
    if (data.stockQuantity !== undefined) {
      updates.stockQuantity = data.stockQuantity;
    }
    if (data.price !== undefined) {
      updates.price = data.price as Price;
    }

    return this.productRepository.update(productId, updates);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const productId = createProductId(id);
    return this.productRepository.delete(productId);
  }
}
