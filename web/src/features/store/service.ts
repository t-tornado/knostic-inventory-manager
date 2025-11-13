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
  IStoreService,
  StoreQueryParams,
  StoreQueryResult,
  StoreDetails,
  ProductQueryParams,
  ProductQueryResult,
} from "./types";
import type { Store } from "@/core/models/store/model";
import { buildQueryParams } from "@/shared/utils/queryParams";

export function createStoreService(apiClient: BaseApiClient): IStoreService {
  return {
    async getStores(params?: StoreQueryParams): Promise<StoreQueryResult> {
      const queryParams = buildQueryParams(params);
      const url = buildUrl("/stores", queryParams);
      return getRequest<StoreQueryResult>(
        apiClient,
        url,
        "No data returned from stores API"
      );
    },

    async getStoreDetails(id: string): Promise<StoreDetails> {
      const url = `/stores/${id}/details`;
      return getRequest<StoreDetails>(
        apiClient,
        url,
        "No data returned from store details API"
      );
    },

    async getStoreProducts(
      storeId: string,
      params?: ProductQueryParams
    ): Promise<ProductQueryResult> {
      const queryParams = buildQueryParams(params);
      const url = buildUrl(`/stores/${storeId}/products`, queryParams);
      return getRequest<ProductQueryResult>(
        apiClient,
        url,
        "No data returned from store products API"
      );
    },

    async createStore(data: { name: string }): Promise<Store> {
      const url = "/stores";
      return postRequest<Store>(
        apiClient,
        url,
        data,
        "No data returned from create store API"
      );
    },

    async updateStore(id: string, data: { name: string }): Promise<Store> {
      const url = `/stores/${id}`;
      return putRequest<Store>(
        apiClient,
        url,
        data,
        "No data returned from update store API"
      );
    },

    async deleteStore(id: string): Promise<void> {
      const url = `/stores/${id}`;
      return deleteRequest(apiClient, url, "Failed to delete store");
    },
  };
}

export const storeService = createStoreService(apiClient);
