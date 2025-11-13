import type { IHttpServer } from "./IHttpServer";
import type { Request, Response } from "express";
import type { StoreController } from "./controllers/StoreController";
import type { ProductController } from "./controllers/ProductController";
import type { DashboardController } from "./controllers/DashboardController";
import { successResponse } from "./types";
import { apiPath } from "../../shared/config/apiVersion";
import { validateTableQueryMiddleware } from "./middleware/validateTableQuery";
import { validateCreateStoreMiddleware } from "./middleware/validateCreateStore";

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
  server.get("/", async (req: Request, res: Response) => {
    const response = successResponse(
      { message: "Inventory Manager API", status: "ok" },
      "/",
      "GET"
    );
    res.status(200).json(response);
  });

  // Store routes
  server.get(
    apiPath("/stores"),
    validateTableQueryMiddleware(apiPath("/stores")),
    (req: Request, res: Response) => storeController.getAllStores(req, res)
  );
  server.get(apiPath("/stores/:id"), (req: Request, res: Response) =>
    storeController.getStoreById(req, res)
  );
  server.get(apiPath("/stores/:id/details"), (req: Request, res: Response) =>
    storeController.getStoreDetails(req, res)
  );
  server.post(
    apiPath("/stores"),
    validateCreateStoreMiddleware(apiPath("/stores")),
    (req: Request, res: Response) => storeController.createStore(req, res)
  );
  server.put(apiPath("/stores/:id"), (req: Request, res: Response) =>
    storeController.updateStore(req, res)
  );
  server.delete(apiPath("/stores/:id"), (req: Request, res: Response) =>
    storeController.deleteStore(req, res)
  );

  // Product routes
  server.get(
    apiPath("/products"),
    validateTableQueryMiddleware(apiPath("/products")),
    (req: Request, res: Response) => productController.getAllProducts(req, res)
  );
  server.get(apiPath("/products/:id"), (req: Request, res: Response) =>
    productController.getProductById(req, res)
  );
  server.get(
    apiPath("/stores/:storeId/products"),
    validateTableQueryMiddleware(apiPath("/stores/:storeId/products")),
    (req: Request, res: Response) =>
      productController.getProductsByStoreId(req, res)
  );
  server.post(apiPath("/products"), (req: Request, res: Response) =>
    productController.createProduct(req, res)
  );
  server.put(apiPath("/products/:id"), (req: Request, res: Response) =>
    productController.updateProduct(req, res)
  );
  server.delete(apiPath("/products/:id"), (req: Request, res: Response) =>
    productController.deleteProduct(req, res)
  );

  // Dashboard routes
  server.get(apiPath("/dashboard"), (req: Request, res: Response) =>
    dashboardController.getAllDashboardData(req, res)
  );
  server.get(apiPath("/dashboard/stats"), (req: Request, res: Response) =>
    dashboardController.getStats(req, res)
  );
  server.get(apiPath("/dashboard/categories"), (req: Request, res: Response) =>
    dashboardController.getCategoryData(req, res)
  );
  server.get(apiPath("/dashboard/stores"), (req: Request, res: Response) =>
    dashboardController.getStoreData(req, res)
  );
  server.get(
    apiPath("/dashboard/stock-levels"),
    (req: Request, res: Response) =>
      dashboardController.getStockLevelData(req, res)
  );
  server.get(
    apiPath("/dashboard/inventory-value"),
    (req: Request, res: Response) =>
      dashboardController.getInventoryValueData(req, res)
  );
  server.get(apiPath("/dashboard/alerts"), (req: Request, res: Response) =>
    dashboardController.getLowStockAlerts(req, res)
  );
  server.get(apiPath("/dashboard/activity"), (req: Request, res: Response) =>
    dashboardController.getRecentActivity(req, res)
  );
}
