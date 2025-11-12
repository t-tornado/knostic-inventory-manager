import { lazy } from "react";
import type { FeatureRoutes } from "../../shared/types";

export const storeRoutes: FeatureRoutes = [
  {
    path: "/stores",
    element: lazy(() =>
      import("./pages/StoreList").then((module) => ({
        default: module.StoreList,
      }))
    ),
  },
  {
    path: "/stores/:id",
    element: lazy(() =>
      import("./pages/StoreDetails").then((module) => ({
        default: module.StoreDetails,
      }))
    ),
  },
];
