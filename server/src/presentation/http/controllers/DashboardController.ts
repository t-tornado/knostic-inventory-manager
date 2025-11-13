import type { Request, Response, NextFunction } from "express";
import type { DashboardService } from "../../../application/services/dashboard";
import { successResponse } from "../types";
import { apiPath } from "../../../shared/config/apiVersion";

export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  async getAllDashboardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const path = apiPath("/dashboard");
    try {
      const data = await this.dashboardService.getAllDashboardData();

      const response = successResponse(data, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const path = apiPath("/dashboard/activity");
    try {
      const activity = await this.dashboardService.getRecentActivity();
      const response = successResponse(activity, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
