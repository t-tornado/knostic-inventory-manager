import type React from "react";

export interface FeatureRoute {
  path: string;
  element: React.ComponentType<unknown>;
}

export type FeatureRoutes = FeatureRoute[];

export interface TableQueryParams {
  search?: string;
  filters?: string;
  page?: number;
  pageSize?: number;
}
