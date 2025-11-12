import type {
  StoreQueryParams,
  ProductQueryParams,
} from "@/features/store/types";

export const queryKeys = {
  stores: {
    all: ["stores"] as const,
    list: (params?: StoreQueryParams) => ["stores", "list", params] as const,
    detail: (id: string) => ["stores", "detail", id] as const,
    detailWithStats: (id: string) => ["stores", "detail", id, "stats"] as const,
  },

  products: {
    all: ["products"] as const,
    list: (params?: ProductQueryParams) =>
      ["products", "list", params] as const,
    detail: (id: string) => ["products", "detail", id] as const,
    byStoreWithParams: (storeId: string, params?: ProductQueryParams) =>
      ["products", "store", storeId, params] as const,
  },

  dashboard: {
    allData: () => ["dashboard", "allData"] as const,
  },
} as const;
