/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiClientFactory } from '../base';
import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

export const createAxiosApiClient: ApiClientFactory<
  InternalAxiosRequestConfig,
  AxiosResponse<any, any, any>
> = (baseURL: string, requestInterceptor, responseInterceptor) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (requestInterceptor) {
    instance.interceptors.request.use(requestInterceptor);
  }

  if (responseInterceptor) {
    instance.interceptors.response.use(responseInterceptor);
  }

  return instance;
};
