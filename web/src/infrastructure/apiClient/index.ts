import axios, { type AxiosInstance } from "axios";
import { dotenv } from "@/shared/config";
import { responseInterceptor, errorInterceptor } from "./interceptors/response";
import type { IApiClient } from "./types";

function createApiClient(): IApiClient {
  const client: AxiosInstance = axios.create({
    baseURL: dotenv.API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  client.interceptors.response.use(responseInterceptor, errorInterceptor);
  return client as unknown as IApiClient;
}

export const apiClient = createApiClient();
export { createApiClient };
export type { IApiClient };
