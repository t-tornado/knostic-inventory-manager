import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { errorResponse } from "../../../presentation/http/types";
import { createInternalServerError } from "../../../domain/errors";

/**
 * Express-specific error handling middleware
 */
export function setupErrorHandler(app: Express): void {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    const path = req.path || req.url || "/";
    const method = req.method || "UNKNOWN";
    const response = errorResponse(
      [
        createInternalServerError(
          "server",
          "INTERNAL_ERROR",
          process.env.NODE_ENV === "development"
            ? err.message
            : "Internal server error"
        ),
      ],
      path,
      method
    );
    res.status(500).json(response);
  });
}
