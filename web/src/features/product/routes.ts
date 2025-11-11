import { lazy } from "react";
import type { FeatureRoutes } from "../../lib/types";

export const productRoutes: FeatureRoutes = [
  {
    path: "/products",
    element: lazy(() =>
      import("./pages/ProductList").then((module) => ({
        default: module.ProductList,
      }))
    ),
  },
];
