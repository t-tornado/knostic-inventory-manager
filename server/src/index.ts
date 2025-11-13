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
import { DashboardRepository } from "./data/repositories/DashboardRepository";
import { StoreService } from "./application/services/StoreService";
import { ProductService } from "./application/services/ProductService";
import { DashboardService } from "./application/services/dashboard";
import { StoreController } from "./presentation/http/controllers/StoreController";
import { ProductController } from "./presentation/http/controllers/ProductController";
import { DashboardController } from "./presentation/http/controllers/DashboardController";
import { setupRoutes } from "./presentation/http/routes";
import { Logger } from "./shared/logger";

import path from "path";
import fs from "fs";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
let DB_PATH =
  process.env.DB_PATH ||
  (process.cwd().endsWith("server")
    ? path.resolve(process.cwd(), "data", "inventory.db")
    : path.resolve(process.cwd(), "server", "data", "inventory.db"));

if (DB_PATH !== ":memory:") {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    Logger.info(`Created database directory: ${dbDir}`);
  }
  DB_PATH = path.resolve(DB_PATH);
  Logger.info(`Using database at: ${DB_PATH}`);
}
const SHOULD_SEED = process.env.SEED_DB === "true";

async function bootstrap(): Promise<void> {
  const database = new SqliteDatabase(DB_PATH);
  await database.connect();
  Logger.info("Database connected");

  await runMigrations(database);
  Logger.info("Migrations completed");

  const storeRepository = new StoreRepository(database);
  const productRepository = new ProductRepository(database);
  const dashboardRepository = new DashboardRepository(database);

  if (SHOULD_SEED) {
    await seedDatabase(database, storeRepository, productRepository);
  }

  const storeService = new StoreService(
    storeRepository,
    productRepository,
    database
  );
  const productService = new ProductService(productRepository);
  const dashboardService = new DashboardService(dashboardRepository);

  const storeController = new StoreController(storeService);
  const productController = new ProductController(productService);
  const dashboardController = new DashboardController(dashboardService);

  const httpServer = new ExpressHttpServer();

  setupBodyParser(httpServer.getExpressApp());

  setupRoutes(
    httpServer,
    storeController,
    productController,
    dashboardController
  );

  setupErrorHandler(httpServer.getExpressApp());

  httpServer.listen(PORT, () => {
    Logger.info(`Server is running on port ${PORT}`, { port: PORT });
    Logger.info(`Database: ${DB_PATH}`, { dbPath: DB_PATH });
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    Logger.info("Shutting down gracefully...", { signal: "SIGINT" });
    await database.disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    Logger.info("Shutting down gracefully...", { signal: "SIGTERM" });
    await database.disconnect();
    process.exit(0);
  });
}

bootstrap().catch((error) => {
  Logger.error("Failed to start server", error as Error);
  process.exit(1);
});
