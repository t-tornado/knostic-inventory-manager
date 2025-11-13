import { lazy } from "react";
import type { FeatureRoutes } from "../../shared/types";

/**
 *
 * @description Routes for the Dashboard page.
 * This is here to create a stable definition for the dashboard routes
 *  All routes should be lazy loaded and defined here.
 */
export const dashboardRoutes: FeatureRoutes = [
  {
    path: "/dashboard",
    element: lazy(() =>
      import("./pages/Dashboard").then((module) => ({
        default: module.DashboardPage,
      }))
    ),
  },
];
