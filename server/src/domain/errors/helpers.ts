import type {
  ServerError,
  ValidationError,
  NotFoundError,
  DbError,
  InternalServerError,
} from "./types";

export function createValidationError(
  field: string,
  code: string,
  message: string
): ValidationError {
  return {
    type: "validation",
    field,
    code,
    message,
  };
}

export function createNotFoundError(
  field: string,
  code: string,
  message: string
): NotFoundError {
  return {
    type: "not_found",
    field,
    code,
    message,
  };
}

export function createDbError(
  field: string,
  code: string,
  message: string
): DbError {
  return {
    type: "db",
    field,
    code,
    message,
  };
}

export function createInternalServerError(
  field: string,
  code: string,
  message: string
): InternalServerError {
  return {
    type: "internal_server_error",
    field,
    code,
    message,
  };
}
