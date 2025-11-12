import type { IHttpRequest, IHttpResponse } from "../IHttpServer";
import type { DashboardService } from "../../../application/services/DashboardService";
import { successResponse, errorResponse } from "../types";
import { createInternalServerError } from "../../../domain/errors";

export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  async getStats(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const path = "/api/dashboard/stats";
    try {
      const stats = await this.dashboardService.getStats();
      const response = successResponse(stats, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "dashboard",
            "FETCH_ERROR",
            "Failed to fetch dashboard stats"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async getCategoryData(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const path = "/api/dashboard/categories";
    try {
      const data = await this.dashboardService.getCategoryData();
      const response = successResponse(data, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "dashboard",
            "FETCH_ERROR",
            "Failed to fetch category data"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async getStoreData(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const path = "/api/dashboard/stores";
    const view = req.query.view as "count" | "value" | undefined;
    try {
      const data = await this.dashboardService.getStoreData();
      const sortedData =
        view === "value"
          ? [...data].sort((a, b) => b.inventoryValue - a.inventoryValue)
          : data;
      const response = successResponse(sortedData, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "dashboard",
            "FETCH_ERROR",
            "Failed to fetch store data"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async getStockLevelData(
    req: IHttpRequest,
    res: IHttpResponse
  ): Promise<void> {
    const path = "/api/dashboard/stock-levels";
    const period = (req.query.period as "7d" | "30d" | "90d") || "7d";
    try {
      const data = await this.dashboardService.getStockLevelData(period);
      const response = successResponse(data, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "dashboard",
            "FETCH_ERROR",
            "Failed to fetch stock level data"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async getInventoryValueData(
    req: IHttpRequest,
    res: IHttpResponse
  ): Promise<void> {
    const path = "/api/dashboard/inventory-value";
    const period = (req.query.period as "7d" | "30d" | "90d") || "7d";
    try {
      const data = await this.dashboardService.getInventoryValueData(period);
      const response = successResponse(data, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "dashboard",
            "FETCH_ERROR",
            "Failed to fetch inventory value data"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async getLowStockAlerts(
    req: IHttpRequest,
    res: IHttpResponse
  ): Promise<void> {
    const path = "/api/dashboard/alerts";
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    try {
      const alerts = await this.dashboardService.getLowStockAlerts(limit);
      const response = successResponse(alerts, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "dashboard",
            "FETCH_ERROR",
            "Failed to fetch low stock alerts"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async getRecentActivity(
    req: IHttpRequest,
    res: IHttpResponse
  ): Promise<void> {
    const path = "/api/dashboard/activity";
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    try {
      const activity = await this.dashboardService.getRecentActivity(limit);
      const response = successResponse(activity, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "dashboard",
            "FETCH_ERROR",
            "Failed to fetch recent activity"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async getAllDashboardData(
    req: IHttpRequest,
    res: IHttpResponse
  ): Promise<void> {
    const path = "/api/dashboard";
    try {
      // Parse query parameters for flexible data fetching
      const query = req.query;
      const options = {
        includeStats: query.stats !== "false",
        includeCategories: query.categories !== "false",
        includeStores: query.stores !== "false",
        includeStockLevels: query.stockLevels !== "false",
        includeInventoryValue: query.inventoryValue !== "false",
        includeAlerts: query.alerts !== "false",
        includeActivity: query.activity !== "false",
        stockPeriod: (query.stockPeriod as "7d" | "30d" | "90d") || "7d",
        valuePeriod: (query.valuePeriod as "7d" | "30d" | "90d") || "7d",
        alertsLimit: query.alertsLimit
          ? parseInt(query.alertsLimit as string, 10)
          : 10,
        activityLimit: query.activityLimit
          ? parseInt(query.activityLimit as string, 10)
          : 10,
      };

      const data = await this.dashboardService.getAllDashboardData(options);

      const response = successResponse(data, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "dashboard",
            "FETCH_ERROR",
            "Failed to fetch dashboard data"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }
}
