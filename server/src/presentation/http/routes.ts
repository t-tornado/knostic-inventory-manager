import type { IHttpServer } from "./IHttpServer";
import type { StoreController } from "./controllers/StoreController";
import type { ProductController } from "./controllers/ProductController";
import type { DashboardController } from "./controllers/DashboardController";
import { successResponse } from "./types";
import { apiPath } from "../../shared/config/apiVersion";

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

  // Health check (unversioned)
  server.get("/", async (req, res) => {
    const response = successResponse(
      { message: "Inventory Manager API", status: "ok" },
      "/",
      "GET"
    );
    res.status(200).json(response);
  });

  // Store routes
  server.get(apiPath("/stores"), (req, res) =>
    storeController.getAllStores(req, res)
  );
  server.get(apiPath("/stores/:id"), (req, res) =>
    storeController.getStoreById(req, res)
  );
  server.post(apiPath("/stores"), (req, res) =>
    storeController.createStore(req, res)
  );
  server.put(apiPath("/stores/:id"), (req, res) =>
    storeController.updateStore(req, res)
  );
  server.delete(apiPath("/stores/:id"), (req, res) =>
    storeController.deleteStore(req, res)
  );

  // Product routes
  server.get(apiPath("/products"), (req, res) =>
    productController.getAllProducts(req, res)
  );
  server.get(apiPath("/products/:id"), (req, res) =>
    productController.getProductById(req, res)
  );
  server.get(apiPath("/stores/:storeId/products"), (req, res) =>
    productController.getProductsByStoreId(req, res)
  );
  server.post(apiPath("/products"), (req, res) =>
    productController.createProduct(req, res)
  );
  server.put(apiPath("/products/:id"), (req, res) =>
    productController.updateProduct(req, res)
  );
  server.delete(apiPath("/products/:id"), (req, res) =>
    productController.deleteProduct(req, res)
  );

  // Dashboard routes
  server.get(apiPath("/dashboard"), (req, res) =>
    dashboardController.getAllDashboardData(req, res)
  );
  server.get(apiPath("/dashboard/stats"), (req, res) =>
    dashboardController.getStats(req, res)
  );
  server.get(apiPath("/dashboard/categories"), (req, res) =>
    dashboardController.getCategoryData(req, res)
  );
  server.get(apiPath("/dashboard/stores"), (req, res) =>
    dashboardController.getStoreData(req, res)
  );
  server.get(apiPath("/dashboard/stock-levels"), (req, res) =>
    dashboardController.getStockLevelData(req, res)
  );
  server.get(apiPath("/dashboard/inventory-value"), (req, res) =>
    dashboardController.getInventoryValueData(req, res)
  );
  server.get(apiPath("/dashboard/alerts"), (req, res) =>
    dashboardController.getLowStockAlerts(req, res)
  );
  server.get(apiPath("/dashboard/activity"), (req, res) =>
    dashboardController.getRecentActivity(req, res)
  );
}
