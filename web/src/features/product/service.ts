import type { BaseApiClient } from "@/infrastructure/apiClient/base";
import { apiClient } from "@/infrastructure/apiClient";
import {
  buildUrl,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "@/infrastructure/apiClient/requestHelpers";
import type {
  IProductService,
  ProductQueryParams,
  ProductQueryResult,
  RawProductType,
} from "./types";
import type { Product } from "@/core/models/product/model";
import { buildQueryParams } from "@/shared/utils/queryParams";

export function createProductService(
  apiClient: BaseApiClient
): IProductService {
  return {
    async getProducts(
      params?: ProductQueryParams
    ): Promise<ProductQueryResult> {
      const queryParams = buildQueryParams(params);
      const url = buildUrl("/products", queryParams);
      return getRequest<ProductQueryResult>(
        apiClient,
        url,
        "No data returned from products API"
      );
    },

    async getProductById(id: string): Promise<Product> {
      const url = `/products/${id}`;
      return getRequest<Product>(
        apiClient,
        url,
        "No data returned from product API"
      );
    },

    async createProduct(product: RawProductType): Promise<Product> {
      const url = "/products";
      return postRequest<Product>(
        apiClient,
        url,
        product,
        "No data returned from create product API"
      );
    },

    async updateProduct(
      id: string,
      product: Partial<RawProductType>
    ): Promise<Product> {
      const url = `/products/${id}`;
      return putRequest<Product>(
        apiClient,
        url,
        product,
        "No data returned from update product API"
      );
    },

    async deleteProduct(id: string): Promise<void> {
      const url = `/products/${id}`;
      return deleteRequest(apiClient, url, "Failed to delete product");
    },
  };
}

export const productService = createProductService(apiClient);
