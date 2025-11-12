import type { BaseApiClient } from "@/infrastructure/apiClient/base";
import type {
  IProductRepository,
  ProductQueryParams,
  ProductQueryResult,
  Product,
} from "./types";
import { ApiResponse } from "@/shared/api";

export function createProductRepository(
  apiClient: BaseApiClient
): IProductRepository {
  return {
    async getProducts(
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
      const url = `/products${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get<ApiResponse<ProductQueryResult>>(
        url
      );

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to fetch products"
        );
      }

      if (!response.data) {
        throw new Error("No data returned from products API");
      }

      return response.data;
    },

    async getProductById(id: string): Promise<Product> {
      const url = `/products/${id}`;

      const response = await apiClient.get<ApiResponse<Product>>(url);

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to fetch product"
        );
      }

      if (!response.data) {
        throw new Error("No data returned from product API");
      }

      return response.data;
    },

    async createProduct(
      product: Omit<Product, "id" | "createdAt" | "updatedAt">
    ): Promise<Product> {
      const url = `/products`;

      const response = await apiClient.post<ApiResponse<Product>>(url, product);

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to create product"
        );
      }

      if (!response.data) {
        throw new Error("No data returned from create product API");
      }

      return response.data;
    },

    async updateProduct(
      id: string,
      product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
    ): Promise<Product> {
      const url = `/products/${id}`;

      const response = await apiClient.put<ApiResponse<Product>>(url, product);

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to update product"
        );
      }

      if (!response.data) {
        throw new Error("No data returned from update product API");
      }

      return response.data;
    },

    async deleteProduct(id: string): Promise<void> {
      const url = `/products/${id}`;

      const response = await apiClient.delete<ApiResponse<void>>(url);

      if (response.errors && response.errors.length > 0) {
        throw new Error(
          response.errors.map((err) => err.message).join(", ") ||
            "Failed to delete product"
        );
      }
    },
  };
}
