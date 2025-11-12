import sqlite3 from "sqlite3";
import type { IDatabase } from "./IDatabase";

export class SqliteDatabase implements IDatabase {
  private db: sqlite3.Database | null = null;
  private dbPath: string;

  constructor(dbPath: string = ":memory:") {
    this.dbPath = dbPath;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          // Enable foreign keys
          this.db!.run("PRAGMA foreign_keys = ON", (err) => {
            if (err) reject(err);
            else resolve();
          });
        }
      });
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }
      this.db.close((err) => {
        if (err) reject(err);
        else {
          this.db = null;
          resolve();
        }
      });
    });
  }

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    if (!this.db) {
      throw new Error("Database not connected");
    }
    return new Promise((resolve, reject) => {
      this.db!.all(sql, params, (err: Error | null, rows: T[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async execute(
    sql: string,
    params: unknown[] = []
  ): Promise<{ lastID?: number; changes: number }> {
    if (!this.db) {
      throw new Error("Database not connected");
    }
    return new Promise((resolve, reject) => {
      this.db!.run(
        sql,
        params,
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve({
              lastID: this.lastID,
              changes: this.changes,
            });
          }
        }
      );
    });
  }

  async transaction<T>(callback: (db: IDatabase) => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error("Database not connected");
    }
    await this.execute("BEGIN TRANSACTION");
    try {
      const result = await callback(this);
      await this.execute("COMMIT");
      return result;
    } catch (error) {
      await this.execute("ROLLBACK");
      throw error;
    }
  }
}
