import type {
  IProductRepository,
  ProductQueryParams,
  ProductQueryResult,
} from "../../domain/repositories/IProductRepository";
import type { Product, ProductId } from "../../domain/entities/Product";
import type { StoreId } from "../../domain/entities/Store";
import type { ISODateTime, Price } from "../../domain/entities/ValueObject";
import type { IDatabase } from "../../infrastructure/database";
import { buildFilterConditions } from "./filterBuilder";
import type { Filter } from "../../domain/repositories/filterTypes";

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

  async findByStoreIdWithParams(
    storeId: StoreId,
    params?: ProductQueryParams
  ): Promise<ProductQueryResult> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 25;
    const offset = (page - 1) * pageSize;

    const conditions: string[] = ["store_id = ?"];
    const queryParams: unknown[] = [storeId];

    if (params?.search) {
      conditions.push("(name LIKE ? OR category LIKE ? OR id LIKE ?)");
      const searchTerm = `%${params.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (params?.filters) {
      try {
        const filters = JSON.parse(params.filters) as Filter[];
        const filterConditions = buildFilterConditions(filters, queryParams);
        if (filterConditions) {
          conditions.push(filterConditions);
        }
      } catch (error) {
        console.error("Failed to parse filters:", error);
      }
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    let orderBy = "ORDER BY created_at DESC";
    if (params?.sort) {
      try {
        const sortArray = JSON.parse(params.sort) as Array<{
          id: string;
          direction: "asc" | "desc";
        }>;
        if (sortArray.length > 0) {
          const sort = sortArray[0];
          if (sort) {
            const direction = sort.direction.toUpperCase();
            const fieldMap: Record<string, string> = {
              name: "name",
              category: "category",
              stockQuantity: "stock_quantity",
              stock_quantity: "stock_quantity",
              price: "price",
              createdAt: "created_at",
              created_at: "created_at",
              updatedAt: "updated_at",
              updated_at: "updated_at",
            };
            const column = fieldMap[sort.id] || sort.id;
            if (column) {
              orderBy = `ORDER BY ${column} ${direction}`;
            }
          }
        }
      } catch {}
    }

    const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const countResult = await this.db.query<{ total: number }>(
      countQuery,
      queryParams
    );
    const total = countResult[0]?.total || 0;

    const dataQuery = `SELECT * FROM products ${whereClause} ${orderBy} LIMIT ? OFFSET ?`;
    const rows = await this.db.query<ProductRow>(dataQuery, [
      ...queryParams,
      pageSize,
      offset,
    ]);

    return {
      data: rows.map((row) => this.rowToEntity(row)),
      total,
      page,
      pageSize,
    };
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
