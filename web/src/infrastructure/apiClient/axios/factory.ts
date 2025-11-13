import type { ApiClientFactory } from "../base";
import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

export const createAxiosApiClient: ApiClientFactory<
  InternalAxiosRequestConfig,
  AxiosResponse<unknown, unknown, unknown>
> = (baseURL: string, requestInterceptor, responseInterceptor) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (requestInterceptor) {
    instance.interceptors.request.use(requestInterceptor);
  }

  if (responseInterceptor) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance.interceptors.response.use(responseInterceptor as any);
  }

  return instance;
};
