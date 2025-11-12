/**
 * Shared API types for all API responses
 * These types match the server's RESTful API response structure
 */

/**
 * Server error structure returned in API error responses
 */
export interface ServerError {
  type: string;
  field: string;
  code: string;
  message: string;
}

/**
 * RESTful API Response structure following REST API design best practices
 * This matches the server's ApiResponse type
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
