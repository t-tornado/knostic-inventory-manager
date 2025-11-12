/**
 * Global query keys configuration
 * Centralized location for all React Query keys used across the application
 *
 * This file should be updated frequently as new queries are added.
 * All useQuery and useMutation calls should use keys from this config.
 */

export const queryKeys = {
  // Stores
  stores: {
    all: ["stores"] as const,
    lists: () => [...queryKeys.stores.all, "list"] as const,
    list: (params?: {
      search?: string;
      filters?: string;
      sort?: string;
      page?: number;
      pageSize?: number;
    }) => [...queryKeys.stores.lists(), params] as const,
    details: () => [...queryKeys.stores.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.stores.details(), id] as const,
    detailWithStats: (id: string) =>
      [...queryKeys.stores.detail(id), "stats"] as const,
  },

  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (params?: {
      search?: string;
      filters?: string;
      sort?: string;
      page?: number;
      pageSize?: number;
    }) => [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    byStore: (storeId: string) =>
      [...queryKeys.products.all, "store", storeId] as const,
    byStoreWithParams: (
      storeId: string,
      params?: {
        search?: string;
        filters?: string;
        sort?: string;
        page?: number;
        pageSize?: number;
      }
    ) => [...queryKeys.products.byStore(storeId), params] as const,
  },

  // Dashboard
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    categories: () => [...queryKeys.dashboard.all, "categories"] as const,
    stores: () => [...queryKeys.dashboard.all, "stores"] as const,
    stockLevels: () => [...queryKeys.dashboard.all, "stockLevels"] as const,
    inventoryValue: () =>
      [...queryKeys.dashboard.all, "inventoryValue"] as const,
    alerts: () => [...queryKeys.dashboard.all, "alerts"] as const,
    activity: () => [...queryKeys.dashboard.all, "activity"] as const,
    allData: (options?: {
      includeStats?: boolean;
      includeCategories?: boolean;
      includeStores?: boolean;
      includeStockLevels?: boolean;
      includeInventoryValue?: boolean;
      includeAlerts?: boolean;
      includeActivity?: boolean;
    }) => [...queryKeys.dashboard.all, "all", options] as const,
  },
} as const;
