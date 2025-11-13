import { type Express, type Request, type Response } from "express";
import { errorResponse } from "../../../presentation/http/types";
import {
  createInternalServerError,
  type ServerError,
} from "../../../domain/errors";
import { Logger } from "../../../shared/logger";

function getStatusCodeForError(error: ServerError): number {
  switch (error.type) {
    case "validation":
      return 400;
    case "not_found":
      return 404;
    case "db":
      return 500;
    case "internal_server_error":
      return 500;
    default:
      return 500;
  }
}

/**
 * Integrated error handling middleware
 */
export function setupErrorHandler(app: Express): void {
  app.use((err: Error, req: Request, res: Response, _next: () => void) => {
    const context = {
      path: req.path || req.url || "/",
      method: req.method || "UNKNOWN",
      params: req.params,
      query: req.query,
      body: req.body,
    };

    Logger.error("Request error", err, context);

    const domainError = err as unknown as ServerError;
    if (
      domainError.type &&
      domainError.code &&
      domainError.message &&
      domainError.field
    ) {
      const statusCode = getStatusCodeForError(domainError);
      const response = errorResponse(
        [domainError],
        context.path,
        context.method
      );
      res.status(statusCode).json(response);
      return;
    }

    // Handle unknown errors
    const isDevelopment = process.env.NODE_ENV === "development";
    const response = errorResponse(
      [
        createInternalServerError(
          "server",
          "INTERNAL_ERROR",
          isDevelopment ? err.message : "Internal server error"
        ),
      ],
      context.path,
      context.method
    );
    res.status(500).json(response);
  });
}
