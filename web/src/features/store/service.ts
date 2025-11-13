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
  IStoreService,
  StoreQueryParams,
  StoreQueryResult,
  StoreDetails,
  ProductQueryParams,
  ProductQueryResult,
} from "./types";
import type { Store } from "@/core/models/store/model";
import { buildQueryParams } from "@/shared/utils/queryParams";

export const createStoreService = (
  client: IApiClient = defaultClient
): IStoreService => ({
  async getStores(params?: StoreQueryParams): Promise<StoreQueryResult> {
    const queryParams = buildQueryParams(params);
    const url = buildUrl("/stores", queryParams);
    return getRequest<StoreQueryResult>(
      client,
      url,
      "No data returned from stores API"
    );
  },

  async getStoreDetails(id: string): Promise<StoreDetails> {
    const url = `/stores/${id}/details`;
    return getRequest<StoreDetails>(
      client,
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
      client,
      url,
      "No data returned from store products API"
    );
  },

  async createStore(data: { name: string }): Promise<Store> {
    const url = "/stores";
    return postRequest<Store>(
      client,
      url,
      data,
      "No data returned from create store API"
    );
  },

  async updateStore(id: string, data: { name: string }): Promise<Store> {
    const url = `/stores/${id}`;
    return putRequest<Store>(
      client,
      url,
      data,
      "No data returned from update store API"
    );
  },

  async deleteStore(id: string): Promise<void> {
    const url = `/stores/${id}`;
    return deleteRequest(client, url, "Failed to delete store");
  },
});

export const storeService = createStoreService();
