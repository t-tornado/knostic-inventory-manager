/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
export interface BaseApiClient {
  get<T extends object = object>(url: string): Promise<T>;
  post<T extends object = object>(url: string, data: unknown): Promise<T>;
  put<T extends object = object>(url: string, data: unknown): Promise<T>;
  delete<T extends unknown = unknown>(url: string): Promise<T>;
}

export type InterceptorFn<T extends object = object> = (config: T) => T;

export type ApiClientFactory<
  TReqConfig extends object = object,
  TResConfig extends object = object
> = (
  baseURL: string,
  requestInterceptor?: InterceptorFn<TReqConfig>,
  responseInterceptor?: InterceptorFn<TResConfig>
) => BaseApiClient;
