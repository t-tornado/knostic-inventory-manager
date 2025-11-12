import type { BaseApiClient } from "@/infrastructure/apiClient/base";
import type {
  IStoreRepository,
  StoreQueryParams,
  StoreQueryResult,
  StoreDetails,
  ProductQueryParams,
  ProductQueryResult,
} from "./types";
import { ApiResponse } from "@/shared/api";

export function createStoreRepository(
  apiClient: BaseApiClient
): IStoreRepository {
  return {
    async getStores(params?: StoreQueryParams): Promise<StoreQueryResult> {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params?.search) {
        queryParams.append("search", params.search);
      }
      if (params?.filters) {
        queryParams.append("filters", params.filters);
      }
      if (params?.sort) {
        queryParams.append("sort", params.sort);
      }
      if (params?.page !== undefined) {
        queryParams.append("page", params.page.toString());
      }
      if (params?.pageSize !== undefined) {
        queryParams.append("pageSize", params.pageSize.toString());
      }

      const queryString = queryParams.toString();
      const url = `/stores${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get<ApiResponse<StoreQueryResult>>(url);

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to fetch stores"
        );
      }

      if (!response.data) {
        throw new Error("No data returned from stores API");
      }

      return response.data;
    },

    async getStoreDetails(id: string): Promise<StoreDetails> {
      const url = `/stores/${id}/details`;

      const response = await apiClient.get<ApiResponse<StoreDetails>>(url);

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to fetch store details"
        );
      }

      if (!response.data) {
        throw new Error("No data returned from store details API");
      }

      return response.data;
    },

    async getStoreProducts(
      storeId: string,
      params?: ProductQueryParams
    ): Promise<ProductQueryResult> {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params?.search) {
        queryParams.append("search", params.search);
      }
      if (params?.filters) {
        queryParams.append("filters", params.filters);
      }
      if (params?.sort) {
        queryParams.append("sort", params.sort);
      }
      if (params?.page !== undefined) {
        queryParams.append("page", params.page.toString());
      }
      if (params?.pageSize !== undefined) {
        queryParams.append("pageSize", params.pageSize.toString());
      }

      const queryString = queryParams.toString();
      const url = `/stores/${storeId}/products${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await apiClient.get<ApiResponse<ProductQueryResult>>(
        url
      );

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to fetch store products"
        );
      }

      if (!response.data) {
        throw new Error("No data returned from store products API");
      }

      return response.data;
    },
  };
}
