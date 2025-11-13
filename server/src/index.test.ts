import request from "supertest";
import type { Express } from "express";
import type { IDatabase } from "./infrastructure/database";
import { SqliteDatabase, runMigrations } from "./infrastructure/database";
import {
  ExpressHttpServer,
  setupBodyParser,
  setupErrorHandler,
} from "./infrastructure/http";
import { StoreRepository } from "./data/repositories/StoreRepository";
import { ProductRepository } from "./data/repositories/ProductRepository";
import { StoreService } from "./application/services/StoreService";
import { ProductService } from "./application/services/ProductService";
import { DashboardService } from "./application/services/dashboard";
import { StoreController } from "./presentation/http/controllers/StoreController";
import { ProductController } from "./presentation/http/controllers/ProductController";
import { DashboardController } from "./presentation/http/controllers/DashboardController";
import { setupRoutes } from "./presentation/http/routes";
import * as fs from "fs";
import * as path from "path";

describe("API Integration Tests", () => {
  let app: Express;
  let database: IDatabase;
  let testDbPath: string;

  beforeAll(async () => {
    const originalDbPath = path.join(__dirname, "../data/inventory.db");
    testDbPath = path.join(__dirname, "../data/inventory.test.db");

    if (fs.existsSync(originalDbPath)) {
      fs.copyFileSync(originalDbPath, testDbPath);
    }

    database = new SqliteDatabase(testDbPath);
    await database.connect();
    await runMigrations(database);

    const storeRepository = new StoreRepository(database);
    const productRepository = new ProductRepository(database);

    const storeService = new StoreService(
      storeRepository,
      productRepository,
      database
    );
    const productService = new ProductService(productRepository);
    const dashboardService = new DashboardService(database);

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

    app = httpServer.getExpressApp();
  });

  afterAll(async () => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    await database.disconnect();
  });

  describe("GET /api/v1/stores", () => {
    it("should return stores with pagination", async () => {
      const response = await request(app)
        .get("/api/v1/stores")
        .query({ page: 1, pageSize: 10 })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("total");
      expect(response.body.data).toHaveProperty("page");
      expect(response.body.data).toHaveProperty("pageSize");
    });

    it("should validate query parameters", async () => {
      const response = await request(app)
        .get("/api/v1/stores")
        .query({ page: "invalid", pageSize: -1 })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("GET /api/v1/products", () => {
    it("should return products with pagination", async () => {
      const response = await request(app)
        .get("/api/v1/products")
        .query({ page: 1, pageSize: 10 })
        .expect(200);

      expect(response.body).toHaveProperty("data");
    });

    it("should validate query parameters", async () => {
      const response = await request(app)
        .get("/api/v1/products")
        .query({ page: "invalid" })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("POST /api/v1/stores", () => {
    it("should create a new store", async () => {
      const response = await request(app)
        .post("/api/v1/stores")
        .send({ name: "Test Store" })
        .expect(201);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name", "Test Store");
    });

    it("should validate store name", async () => {
      const response = await request(app)
        .post("/api/v1/stores")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("PUT /api/v1/stores/:id", () => {
    it("should update a store", async () => {
      // First create a store
      const createResponse = await request(app)
        .post("/api/v1/stores")
        .send({ name: "Original Name" })
        .expect(201);

      const storeId = createResponse.body.data.id;

      // Then update it
      const updateResponse = await request(app)
        .put(`/api/v1/stores/${storeId}`)
        .send({ name: "Updated Name" })
        .expect(200);

      expect(updateResponse.body.data).toHaveProperty("name", "Updated Name");
    });
  });

  describe("DELETE /api/v1/stores/:id", () => {
    it("should delete a store", async () => {
      // First create a store
      const createResponse = await request(app)
        .post("/api/v1/stores")
        .send({ name: "To Delete" })
        .expect(201);

      const storeId = createResponse.body.data.id;

      // Then delete it
      await request(app).delete(`/api/v1/stores/${storeId}`).expect(200);
    });
  });
});
