import { apiClient as defaultClient } from "@/infrastructure/apiClient";
import type { IApiClient } from "@/infrastructure/apiClient";
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

export const createProductService = (
  client: IApiClient = defaultClient
): IProductService => ({
  async getProducts(params?: ProductQueryParams): Promise<ProductQueryResult> {
    const queryParams = buildQueryParams(params);
    const url = buildUrl("/products", queryParams);
    return getRequest<ProductQueryResult>(
      client,
      url,
      "No data returned from products API"
    );
  },

  async getProductById(id: string): Promise<Product> {
    const url = `/products/${id}`;
    return getRequest<Product>(
      client,
      url,
      "No data returned from product API"
    );
  },

  async createProduct(product: RawProductType): Promise<Product> {
    const url = "/products";
    return postRequest<Product>(
      client,
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
      client,
      url,
      product,
      "No data returned from update product API"
    );
  },

  async deleteProduct(id: string): Promise<void> {
    const url = `/products/${id}`;
    return deleteRequest(client, url, "Failed to delete product");
  },
});

export const productService = createProductService();
