import type { BaseApiClient } from "@/infrastructure/apiClient/base";
import { apiClient } from "@/infrastructure/apiClient";
import type {
  IStoreService,
  StoreQueryParams,
  StoreQueryResult,
  StoreDetails,
  ProductQueryParams,
  ProductQueryResult,
} from "./types";
import type { Store } from "@/core/models/store/model";
import { ApiResponse } from "@/shared/api";

export function createStoreService(apiClient: BaseApiClient): IStoreService {
  return {
    async getStores(params?: StoreQueryParams): Promise<StoreQueryResult> {
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

    async createStore(data: { name: string }): Promise<Store> {
      const url = `/stores`;

      const response = await apiClient.post<ApiResponse<Store>>(url, data);

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to create store"
        );
      }

      if (!response.data) {
        throw new Error("No data returned from create store API");
      }

      return response.data;
    },

    async updateStore(id: string, data: { name: string }): Promise<Store> {
      const url = `/stores/${id}`;

      const response = await apiClient.put<ApiResponse<Store>>(url, data);

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to update store"
        );
      }

      if (!response.data) {
        throw new Error("No data returned from update store API");
      }

      return response.data;
    },

    async deleteStore(id: string): Promise<void> {
      const url = `/stores/${id}`;

      const response = await apiClient.delete<ApiResponse<void>>(url);

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to delete store"
        );
      }
    },
  };
}

export const storeService = createStoreService(apiClient);
