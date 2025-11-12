import type { IDatabase } from "./IDatabase";

export async function runMigrations(db: IDatabase): Promise<void> {
  // Create stores table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Create products table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      store_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      stock_quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id)
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)
  `);
}
