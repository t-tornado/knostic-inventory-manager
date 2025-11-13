import type { Response, NextFunction } from "express";
import type { HttpMiddleware } from "../../IHttpServer";
import { errorResponse } from "../../types";
import { validateDashboardQuery, validateActivityQuery } from "./validator";
// To augment the Request type with the validated properties
import "../shared/types";

export function validateDashboardQueryMiddleware(path: string): HttpMiddleware {
  return (req, res: Response, next: NextFunction) => {
    const validation = validateDashboardQuery(req);

    if (!validation.valid) {
      const response = errorResponse(validation.errors, path, "GET");
      res.status(400).json(response);
      return;
    }

    req.validatedDashboardQuery = validation.params;
    next();
  };
}

export function validateActivityQueryMiddleware(path: string): HttpMiddleware {
  return (req, res: Response, next: NextFunction) => {
    const validation = validateActivityQuery(req);

    if (!validation.valid) {
      const response = errorResponse(validation.errors, path, "GET");
      res.status(400).json(response);
      return;
    }

    req.validatedActivityQuery = validation.params;
    next();
  };
}
