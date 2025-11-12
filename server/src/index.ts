import {
  ExpressHttpServer,
  setupBodyParser,
  setupErrorHandler,
} from "./infrastructure/http";
import {
  SqliteDatabase,
  runMigrations,
  seedDatabase,
} from "./infrastructure/database";
import { StoreRepository } from "./data/repositories/StoreRepository";
import { ProductRepository } from "./data/repositories/ProductRepository";
import { StoreService } from "./application/services/StoreService";
import { ProductService } from "./application/services/ProductService";
import { DashboardService } from "./application/services/DashboardService";
import { StoreController } from "./presentation/http/controllers/StoreController";
import { ProductController } from "./presentation/http/controllers/ProductController";
import { DashboardController } from "./presentation/http/controllers/DashboardController";
import { setupRoutes } from "./presentation/http/routes";

import path from "path";
import fs from "fs";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// Use file-based database by default, or in-memory if DB_PATH is set to ":memory:"
// Default to ./data/inventory.db relative to the server directory
// When running from server directory, use ./data/inventory.db
// When running from project root, use ./server/data/inventory.db
let DB_PATH =
  process.env.DB_PATH ||
  (process.cwd().endsWith("server")
    ? path.resolve(process.cwd(), "data", "inventory.db")
    : path.resolve(process.cwd(), "server", "data", "inventory.db"));

// Ensure the data directory exists if using a file-based database
if (DB_PATH !== ":memory:") {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`Created database directory: ${dbDir}`);
  }
  // Convert to absolute path
  DB_PATH = path.resolve(DB_PATH);
  console.log(`Using database at: ${DB_PATH}`);
}
// Seed database on startup if SEED_DB is set to 'true' (only for in-memory or empty databases)
const SHOULD_SEED = process.env.SEED_DB === "true";

async function bootstrap(): Promise<void> {
  // Initialize database
  const database = new SqliteDatabase(DB_PATH);
  await database.connect();
  console.log("Database connected");

  // Run migrations
  await runMigrations(database);
  console.log("Migrations completed");

  // Initialize repositories
  const storeRepository = new StoreRepository(database);
  const productRepository = new ProductRepository(database);

  // Seed database if requested
  if (SHOULD_SEED) {
    await seedDatabase(database, storeRepository, productRepository);
  }

  // Initialize services
  const storeService = new StoreService(
    storeRepository,
    productRepository,
    database
  );
  const productService = new ProductService(productRepository);
  const dashboardService = new DashboardService(database);

  // Initialize controllers
  const storeController = new StoreController(storeService);
  const productController = new ProductController(productService);
  const dashboardController = new DashboardController(dashboardService);

  // Initialize HTTP server (Express implementation)
  const httpServer = new ExpressHttpServer();

  // Setup Express-specific middleware (body parser)
  setupBodyParser(httpServer.getExpressApp());

  setupRoutes(
    httpServer,
    storeController,
    productController,
    dashboardController
  );

  setupErrorHandler(httpServer.getExpressApp());

  // Start server
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Database: ${DB_PATH}`);
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\nShutting down gracefully...");
    await database.disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\nShutting down gracefully...");
    await database.disconnect();
    process.exit(0);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
