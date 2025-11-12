import type { ServerError } from "../../domain/errors/types";

/**
 * RESTful API Response structure following REST API design best practices
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  errors?: ServerError[];
  meta?: {
    timestamp: string;
    path: string;
    method: string;
  };
}

/**
 * Success response helper
 */
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

/**
 * Error response helper
 */
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
