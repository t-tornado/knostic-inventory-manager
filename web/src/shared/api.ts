/**
 * Server error structure returned in API error responses
 */
export interface ServerError {
  type: string;
  field: string;
  code: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  errors?: ServerError[];
  meta?: {
    timestamp: string;
    path: string;
    method: string;
  };
}
