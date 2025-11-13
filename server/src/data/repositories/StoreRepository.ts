import type {
  IStoreRepository,
  StoreQueryParams,
  StoreQueryResult,
} from "../../domain/repositories/IStoreRepository";
import type { Store, StoreId } from "../../domain/entities/Store";
import type { ISODateTime } from "../../domain/entities/ValueObject";
import type { IDatabase } from "../../infrastructure/database";
import { buildQuery } from "./queryBuilder";

interface StoreRow {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export class StoreRepository implements IStoreRepository {
  constructor(private db: IDatabase) {}

  private rowToEntity(row: StoreRow): Store {
    return {
      id: row.id as StoreId,
      name: row.name,
      createdAt: row.created_at as ISODateTime,
      updatedAt: row.updated_at as ISODateTime,
    };
  }

  async findAll(params?: StoreQueryParams): Promise<StoreQueryResult> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 25;
    const offset = (page - 1) * pageSize;

    const { whereClause, orderBy, queryParams } = buildQuery({
      searchFields: params?.search ? ["name", "id"] : [],
      searchTerm: params?.search,
      filters: params?.filters,
      sort: params?.sort,
      fieldToColumnMap: {
        name: "name",
        id: "id",
        createdAt: "created_at",
        created_at: "created_at",
        updatedAt: "updated_at",
        updated_at: "updated_at",
      },
    });

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM stores ${whereClause}`;
    const countResult = await this.db.query<{ total: number }>(
      countQuery,
      queryParams
    );
    const total = countResult[0]?.total || 0;

    // Get paginated data
    const dataQuery = `SELECT * FROM stores ${whereClause} ${orderBy} LIMIT ? OFFSET ?`;
    const rows = await this.db.query<StoreRow>(dataQuery, [
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

  async findById(id: StoreId): Promise<Store | null> {
    const rows = await this.db.query<StoreRow>(
      "SELECT * FROM stores WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return this.rowToEntity(rows[0]!);
  }

  async create(
    store: Omit<Store, "id" | "createdAt" | "updatedAt">
  ): Promise<Store> {
    const now = new Date().toISOString() as ISODateTime;
    const result = await this.db.execute(
      "INSERT INTO stores (name, created_at, updated_at) VALUES (?, ?, ?)",
      [store.name, now, now]
    );
    const id = result.lastID as number;
    return {
      id: id as StoreId,
      name: store.name,
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(
    id: StoreId,
    store: Partial<Omit<Store, "id" | "createdAt">>
  ): Promise<Store> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Store with id ${id} not found`);
    }

    const updated: Store = {
      ...existing,
      ...store,
      updatedAt: new Date().toISOString() as ISODateTime,
    };

    await this.db.execute(
      "UPDATE stores SET name = ?, updated_at = ? WHERE id = ?",
      [updated.name, updated.updatedAt, id]
    );

    return updated;
  }

  async delete(id: StoreId, transactionDb?: IDatabase): Promise<boolean> {
    const db = transactionDb || this.db;
    const result = await db.execute("DELETE FROM stores WHERE id = ?", [id]);
    return result.changes > 0;
  }
}
