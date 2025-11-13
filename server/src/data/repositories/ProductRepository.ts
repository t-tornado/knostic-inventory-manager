import type {
  IProductRepository,
  ProductQueryParams,
  ProductQueryResult,
} from "../../domain/repositories/IProductRepository";
import type { Product, ProductId } from "../../domain/entities/Product";
import type { StoreId } from "../../domain/entities/Store";
import type { ISODateTime, Price } from "../../domain/entities/ValueObject";
import type { IDatabase } from "../../infrastructure/database";
import { buildQuery } from "./queryBuilder";

interface ProductRow {
  id: number;
  store_id: number;
  store_name?: string;
  name: string;
  category: string;
  stock_quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithStoreName extends Product {
  storeName?: string | undefined;
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

  private rowToEntityWithStoreName(row: ProductRow): ProductWithStoreName {
    return {
      ...this.rowToEntity(row),
      storeName: row.store_name ?? undefined,
    };
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.db.query<ProductRow>(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    return rows.map((row) => this.rowToEntity(row));
  }

  async findAllWithParams(
    params?: ProductQueryParams
  ): Promise<ProductQueryResult> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 25;
    const offset = (page - 1) * pageSize;

    const {
      whereClause: baseWhereClause,
      orderBy: baseOrderBy,
      queryParams,
    } = buildQuery({
      searchFields: params?.search ? ["name", "category", "id"] : [],
      searchTerm: params?.search,
      filters: params?.filters,
      sort: params?.sort,
      fieldToColumnMap: {
        name: "name",
        category: "category",
        stockQuantity: "stock_quantity",
        stock_quantity: "stock_quantity",
        price: "price",
        createdAt: "created_at",
        created_at: "created_at",
        updatedAt: "updated_at",
        updated_at: "updated_at",
      },
    });

    const countQuery = `SELECT COUNT(*) as total FROM products ${baseWhereClause}`;
    const countResult = await this.db.query<{ total: number }>(
      countQuery,
      queryParams
    );
    const total = countResult[0]?.total || 0;

    const whereClauseForJoin = baseWhereClause.replace(
      /\b(name|category|stock_quantity|price|created_at|updated_at|id)\b/g,
      "p.$1"
    );
    const orderByForJoin = baseOrderBy.replace(
      /\b(name|category|stock_quantity|price|created_at|updated_at|id)\b/g,
      "p.$1"
    );
    const dataQuery = `SELECT p.*, s.name as store_name FROM products p LEFT JOIN stores s ON p.store_id = s.id ${whereClauseForJoin} ${orderByForJoin} LIMIT ? OFFSET ?`;
    const rows = await this.db.query<ProductRow>(dataQuery, [
      ...queryParams,
      pageSize,
      offset,
    ]);

    return {
      data: rows.map((row) => this.rowToEntityWithStoreName(row)) as Product[],
      total,
      page,
      pageSize,
    };
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

    const {
      whereClause: baseWhereClause,
      orderBy,
      queryParams,
    } = buildQuery({
      searchFields: params?.search ? ["name", "category", "id"] : [],
      searchTerm: params?.search,
      filters: params?.filters,
      sort: params?.sort,
      fieldToColumnMap: {
        name: "name",
        category: "category",
        stockQuantity: "stock_quantity",
        stock_quantity: "stock_quantity",
        price: "price",
        createdAt: "created_at",
        created_at: "created_at",
        updatedAt: "updated_at",
        updated_at: "updated_at",
      },
    });

    // Add store_id condition
    const storeCondition = "store_id = ?";
    const whereClause =
      baseWhereClause.length > 0
        ? `${baseWhereClause} AND ${storeCondition}`
        : `WHERE ${storeCondition}`;
    const allParams = [...queryParams, storeId];

    const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const countResult = await this.db.query<{ total: number }>(
      countQuery,
      allParams
    );
    const total = countResult[0]?.total || 0;

    const whereClauseForJoin = whereClause.replace(
      /\b(name|category|stock_quantity|price|created_at|updated_at|id|store_id)\b/g,
      "p.$1"
    );
    const orderByForJoin = orderBy.replace(
      /\b(name|category|stock_quantity|price|created_at|updated_at|id)\b/g,
      "p.$1"
    );
    const dataQuery = `SELECT p.*, s.name as store_name FROM products p LEFT JOIN stores s ON p.store_id = s.id ${whereClauseForJoin} ${orderByForJoin} LIMIT ? OFFSET ?`;
    const rows = await this.db.query<ProductRow>(dataQuery, [
      ...allParams,
      pageSize,
      offset,
    ]);

    return {
      data: rows.map((row) => this.rowToEntityWithStoreName(row)) as Product[],
      total,
      page,
      pageSize,
    };
  }

  async create(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const now = new Date().toISOString() as ISODateTime;
    const result = await this.db.execute(
      "INSERT INTO products (store_id, name, category, stock_quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        product.storeId,
        product.name,
        product.category,
        product.stockQuantity,
        product.price,
        now,
        now,
      ]
    );
    const id = result.lastID as number;
    return {
      id: id as ProductId,
      storeId: product.storeId,
      name: product.name,
      category: product.category,
      stockQuantity: product.stockQuantity,
      price: product.price,
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
