import type { IDatabase } from "./IDatabase";

export async function runMigrations(db: IDatabase): Promise<void> {
  // Create stores table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Create products table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL,
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
