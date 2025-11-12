export interface BaseError {
  type: string;
  field: string;
  code: string;
  message: string;
}

export interface DbError extends BaseError {
  type: "db";
}

export interface ValidationError extends BaseError {
  type: "validation";
}

export interface NotFoundError extends BaseError {
  type: "not_found";
}

export interface InternalServerError extends BaseError {
  type: "internal_server_error";
}

export type ServerError =
  | DbError
  | ValidationError
  | NotFoundError
  | InternalServerError;
