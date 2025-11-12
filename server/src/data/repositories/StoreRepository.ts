import type { IStoreRepository } from "../../domain/repositories/IStoreRepository";
import type { Store, StoreId } from "../../domain/entities/Store";
import type { ISODateTime } from "../../domain/entities/ValueObject";
import type { IDatabase } from "../../infrastructure/database";

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

  async findAll(): Promise<Store[]> {
    const rows = await this.db.query<StoreRow>(
      "SELECT * FROM stores ORDER BY created_at DESC"
    );
    return rows.map((row) => this.rowToEntity(row));
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
