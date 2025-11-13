import type { ServerError } from "../../domain/errors/types";

export interface ApiResponse<T = unknown> {
  data?: T;
  errors?: ServerError[];
  meta?: {
    timestamp: string;
    path: string;
    method: string;
  };
}

export function successResponse<T>(
  data: T,
  path: string,
  method: string
): ApiResponse<T> {
  return {
    data,
    meta: {
      timestamp: new Date().toISOString(),
      path,
      method,
    },
  };
}

export function errorResponse(
  errors: ServerError[],
  path: string,
  method: string
): ApiResponse {
  return {
    errors,
    meta: {
      timestamp: new Date().toISOString(),
      path,
      method,
    },
  };
}

export interface ValidatedTableQueryParams {
  search?: string | undefined;
  filters?: string | undefined;
  sort?: string | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}
