/**
 * Database abstraction interface
 * Allows swapping SQLite with PostgreSQL, MySQL, etc.
 */
export interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(
    sql: string,
    params?: unknown[]
  ): Promise<{ lastID?: number; changes: number }>;
  transaction<T>(callback: (db: IDatabase) => Promise<T>): Promise<T>;
}
