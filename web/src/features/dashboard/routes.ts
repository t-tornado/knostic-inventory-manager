import { lazy } from "react";
import type { FeatureRoutes } from "../../shared/types";

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
