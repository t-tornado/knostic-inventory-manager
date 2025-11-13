export interface IApiClient {
  get<T = unknown>(url: string, config?: unknown): Promise<{ data: T }>;
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<{ data: T }>;
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<{ data: T }>;
  delete<T = unknown>(url: string, config?: unknown): Promise<{ data: T }>;
}
