import type { Product, ProductId } from "../entities/Product";
import type { StoreId } from "../entities/Store";

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: ProductId): Promise<Product | null>;
  findByStoreId(storeId: StoreId): Promise<Product[]>;
  create(product: Omit<Product, "createdAt" | "updatedAt">): Promise<Product>;
  update(
    id: ProductId,
    product: Partial<Omit<Product, "id" | "createdAt">>
  ): Promise<Product>;
  delete(id: ProductId): Promise<boolean>;
  deleteByStoreId(storeId: StoreId): Promise<number>; // Returns count of deleted products
}
