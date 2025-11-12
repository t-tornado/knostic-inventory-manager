import type { IHttpServer } from "./IHttpServer";
import type { StoreController } from "./controllers/StoreController";
import type { ProductController } from "./controllers/ProductController";
import type { DashboardController } from "./controllers/DashboardController";
import { successResponse } from "./types";

export function setupRoutes(
  server: IHttpServer,
  storeController: StoreController,
  productController: ProductController,
  dashboardController: DashboardController
): void {
  // CORS middleware
  server.use(async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  server.use(async (req, res, next) => {
    next();
  });

  // Health check
  server.get("/", async (req, res) => {
    const response = successResponse(
      { message: "Inventory Manager API", status: "ok" },
      "/",
      "GET"
    );
    res.status(200).json(response);
  });

  // Store routes
  server.get("/api/stores", (req, res) =>
    storeController.getAllStores(req, res)
  );
  server.get("/api/stores/:id", (req, res) =>
    storeController.getStoreById(req, res)
  );
  server.post("/api/stores", (req, res) =>
    storeController.createStore(req, res)
  );
  server.put("/api/stores/:id", (req, res) =>
    storeController.updateStore(req, res)
  );
  server.delete("/api/stores/:id", (req, res) =>
    storeController.deleteStore(req, res)
  );

  // Product routes
  server.get("/api/products", (req, res) =>
    productController.getAllProducts(req, res)
  );
  server.get("/api/products/:id", (req, res) =>
    productController.getProductById(req, res)
  );
  server.get("/api/stores/:storeId/products", (req, res) =>
    productController.getProductsByStoreId(req, res)
  );
  server.post("/api/products", (req, res) =>
    productController.createProduct(req, res)
  );
  server.put("/api/products/:id", (req, res) =>
    productController.updateProduct(req, res)
  );
  server.delete("/api/products/:id", (req, res) =>
    productController.deleteProduct(req, res)
  );

  // Dashboard routes
  server.get("/api/dashboard", (req, res) =>
    dashboardController.getAllDashboardData(req, res)
  );
  server.get("/api/dashboard/stats", (req, res) =>
    dashboardController.getStats(req, res)
  );
  server.get("/api/dashboard/categories", (req, res) =>
    dashboardController.getCategoryData(req, res)
  );
  server.get("/api/dashboard/stores", (req, res) =>
    dashboardController.getStoreData(req, res)
  );
  server.get("/api/dashboard/stock-levels", (req, res) =>
    dashboardController.getStockLevelData(req, res)
  );
  server.get("/api/dashboard/inventory-value", (req, res) =>
    dashboardController.getInventoryValueData(req, res)
  );
  server.get("/api/dashboard/alerts", (req, res) =>
    dashboardController.getLowStockAlerts(req, res)
  );
  server.get("/api/dashboard/activity", (req, res) =>
    dashboardController.getRecentActivity(req, res)
  );
}
