import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import type { Product, ProductId } from "../../domain/entities/Product";
import type { StoreId } from "../../domain/entities/Store";
import type { ISODateTime, Price } from "../../domain/entities/ValueObject";
import type { IDatabase } from "../../infrastructure/database";

interface ProductRow {
  id: string;
  store_id: string;
  name: string;
  category: string;
  stock_quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export class ProductRepository implements IProductRepository {
  constructor(private db: IDatabase) {}

  private rowToEntity(row: ProductRow): Product {
    return {
      id: row.id as ProductId,
      storeId: row.store_id as StoreId,
      name: row.name,
      category: row.category,
      stockQuantity: row.stock_quantity,
      price: row.price as Price,
      createdAt: row.created_at as ISODateTime,
      updatedAt: row.updated_at as ISODateTime,
    };
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.db.query<ProductRow>(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    return rows.map((row) => this.rowToEntity(row));
  }

  async findById(id: ProductId): Promise<Product | null> {
    const rows = await this.db.query<ProductRow>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return this.rowToEntity(rows[0]!);
  }

  async findByStoreId(storeId: StoreId): Promise<Product[]> {
    const rows = await this.db.query<ProductRow>(
      "SELECT * FROM products WHERE store_id = ? ORDER BY created_at DESC",
      [storeId]
    );
    return rows.map((row) => this.rowToEntity(row));
  }

  async create(
    product: Omit<Product, "createdAt" | "updatedAt">
  ): Promise<Product> {
    const now = new Date().toISOString() as ISODateTime;
    await this.db.execute(
      "INSERT INTO products (id, store_id, name, category, stock_quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        product.id,
        product.storeId,
        product.name,
        product.category,
        product.stockQuantity,
        product.price,
        now,
        now,
      ]
    );
    return {
      ...product,
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(
    id: ProductId,
    product: Partial<Omit<Product, "id" | "createdAt">>
  ): Promise<Product> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Product with id ${id} not found`);
    }

    const updated: Product = {
      ...existing,
      ...product,
      updatedAt: new Date().toISOString() as ISODateTime,
    };

    await this.db.execute(
      "UPDATE products SET store_id = ?, name = ?, category = ?, stock_quantity = ?, price = ?, updated_at = ? WHERE id = ?",
      [
        updated.storeId,
        updated.name,
        updated.category,
        updated.stockQuantity,
        updated.price,
        updated.updatedAt,
        id,
      ]
    );

    return updated;
  }

  async delete(id: ProductId): Promise<boolean> {
    const result = await this.db.execute("DELETE FROM products WHERE id = ?", [
      id,
    ]);
    return result.changes > 0;
  }

  async deleteByStoreId(storeId: StoreId): Promise<number> {
    const result = await this.db.execute(
      "DELETE FROM products WHERE store_id = ?",
      [storeId]
    );
    return result.changes;
  }
}
