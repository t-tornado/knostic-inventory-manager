#!/usr/bin/env ts-node

import { SqliteDatabase, runMigrations } from "../src/infrastructure/database";
import { StoreRepository } from "../src/data/repositories/StoreRepository";
import { ProductRepository } from "../src/data/repositories/ProductRepository";
import { seedDatabase } from "../src/infrastructure/database/seedDatabase";
import path from "path";
import fs from "fs";

const dbPath = process.argv[2] || path.join(__dirname, "../data/inventory.db");

async function initDatabase(): Promise<void> {
  // Ensure data directory exists
  const dbDir = path.dirname(dbPath);
  if (dbDir !== "." && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`Created directory: ${dbDir}`);
  }

  // Remove existing database if it exists
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log(`Removed existing database: ${dbPath}`);
  }

  console.log(`Initializing database at: ${dbPath}`);

  // Initialize database
  const database = new SqliteDatabase(dbPath);
  await database.connect();
  console.log("Database connected");

  try {
    // Run migrations
    await runMigrations(database);
    console.log("Migrations completed");

    // Initialize repositories
    const storeRepository = new StoreRepository(database);
    const productRepository = new ProductRepository(database);

    // Seed database
    await seedDatabase(database, storeRepository, productRepository);
    console.log("Database seeded successfully");

    console.log(`\n✅ Database initialized successfully at: ${dbPath}`);
  } finally {
    await database.disconnect();
    console.log("Database disconnected");
  }
}

initDatabase().catch((error) => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});
