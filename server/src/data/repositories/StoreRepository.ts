import type {
  IStoreRepository,
  StoreQueryParams,
  StoreQueryResult,
} from "../../domain/repositories/IStoreRepository";
import type { Store, StoreId } from "../../domain/entities/Store";
import type { ISODateTime } from "../../domain/entities/ValueObject";
import type { IDatabase } from "../../infrastructure/database";
import { buildFilterConditions } from "./filterBuilder";
import type { Filter } from "../../domain/repositories/filterTypes";

interface StoreRow {
  id: string;
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

    // Build WHERE clause
    const conditions: string[] = [];
    const queryParams: unknown[] = [];

    // Search functionality (searches across name and id)
    if (params?.search) {
      conditions.push("(name LIKE ? OR id LIKE ?)");
      const searchTerm = `%${params.search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    // Decode and apply filters
    if (params?.filters) {
      try {
        const filters = JSON.parse(params.filters) as Filter[];
        const filterConditions = buildFilterConditions(filters, queryParams);
        if (filterConditions) {
          conditions.push(filterConditions);
        }
      } catch (error) {
        // Invalid filters - ignore
        console.error("Failed to parse filters:", error);
      }
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Build ORDER BY clause
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
            if (sort.id === "name") {
              orderBy = `ORDER BY name ${direction}`;
            } else if (sort.id === "createdAt" || sort.id === "created_at") {
              orderBy = `ORDER BY created_at ${direction}`;
            } else if (sort.id === "updatedAt" || sort.id === "updated_at") {
              orderBy = `ORDER BY updated_at ${direction}`;
            }
          }
        }
      } catch {
        // Invalid sort - ignore
      }
    }

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

  async create(store: Omit<Store, "createdAt" | "updatedAt">): Promise<Store> {
    const now = new Date().toISOString() as ISODateTime;
    await this.db.execute(
      "INSERT INTO stores (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)",
      [store.id, store.name, now, now]
    );
    return {
      ...store,
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

  async delete(id: StoreId): Promise<boolean> {
    const result = await this.db.execute("DELETE FROM stores WHERE id = ?", [
      id,
    ]);
    return result.changes > 0;
  }
}
