import type { IHttpServer } from "./IHttpServer";
import type { Request, Response, NextFunction } from "express";
import type { StoreController } from "./controllers/StoreController";
import type { ProductController } from "./controllers/ProductController";
import type { DashboardController } from "./controllers/DashboardController";
import { successResponse } from "./types";
import { apiPath } from "../../shared/config/apiVersion";
import { validateTableQueryMiddleware } from "./middleware/validateTableQuery";
import { validateCreateStoreMiddleware } from "./middleware/validateCreateStore";
import { validateUpdateStoreMiddleware } from "./middleware/validateUpdateStore";
import { validateCreateProductMiddleware } from "./middleware/validateCreateProduct";
import { validateUpdateProductMiddleware } from "./middleware/validateUpdateProduct";

export function setupRoutes(
  server: IHttpServer,
  storeController: StoreController,
  productController: ProductController,
  dashboardController: DashboardController
): void {
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

  server.get("/", async (req: Request, res: Response) => {
    const response = successResponse(
      { message: "Inventory Manager API", status: "ok" },
      "/",
      "GET"
    );
    res.status(200).json(response);
  });

  server.get(
    apiPath("/stores"),
    validateTableQueryMiddleware(apiPath("/stores")),
    (req: Request, res: Response, next: NextFunction) =>
      storeController.getAllStores(req, res, next)
  );
  server.get(
    apiPath("/stores/:id"),
    (req: Request, res: Response, next: NextFunction) =>
      storeController.getStoreById(req, res, next)
  );
  server.get(
    apiPath("/stores/:id/details"),
    (req: Request, res: Response, next: NextFunction) =>
      storeController.getStoreDetails(req, res, next)
  );
  server.post(
    apiPath("/stores"),
    validateCreateStoreMiddleware(apiPath("/stores")),
    (req: Request, res: Response, next: NextFunction) =>
      storeController.createStore(req, res, next)
  );
  server.put(
    apiPath("/stores/:id"),
    validateUpdateStoreMiddleware(apiPath("/stores/:id")),
    (req: Request, res: Response, next: NextFunction) =>
      storeController.updateStore(req, res, next)
  );
  server.delete(
    apiPath("/stores/:id"),
    (req: Request, res: Response, next: NextFunction) =>
      storeController.deleteStore(req, res, next)
  );

  server.get(
    apiPath("/products"),
    validateTableQueryMiddleware(apiPath("/products")),
    (req: Request, res: Response, next: NextFunction) =>
      productController.getAllProducts(req, res, next)
  );
  server.get(
    apiPath("/products/:id"),
    (req: Request, res: Response, next: NextFunction) =>
      productController.getProductById(req, res, next)
  );
  server.get(
    apiPath("/stores/:storeId/products"),
    validateTableQueryMiddleware(apiPath("/stores/:storeId/products")),
    (req: Request, res: Response, next: NextFunction) =>
      productController.getProductsByStoreId(req, res, next)
  );
  server.post(
    apiPath("/products"),
    validateCreateProductMiddleware(apiPath("/products")),
    (req: Request, res: Response, next: NextFunction) =>
      productController.createProduct(req, res, next)
  );
  server.put(
    apiPath("/products/:id"),
    validateUpdateProductMiddleware(apiPath("/products/:id")),
    (req: Request, res: Response, next: NextFunction) =>
      productController.updateProduct(req, res, next)
  );
  server.delete(
    apiPath("/products/:id"),
    (req: Request, res: Response, next: NextFunction) =>
      productController.deleteProduct(req, res, next)
  );

  server.get(
    apiPath("/dashboard"),
    (req: Request, res: Response, next: NextFunction) =>
      dashboardController.getAllDashboardData(req, res, next)
  );
  server.get(
    apiPath("/dashboard/activity"),
    (req: Request, res: Response, next: NextFunction) =>
      dashboardController.getRecentActivity(req, res, next)
  );
}
