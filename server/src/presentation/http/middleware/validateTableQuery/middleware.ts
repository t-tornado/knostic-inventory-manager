import type { Response, NextFunction } from "express";
import type { HttpMiddleware } from "../../IHttpServer";
import { errorResponse } from "../../types";
import { validateTableQuery } from "./validator";
// To augment the Request type with the validatedTableQuery property
import "../shared/types"; 

export function validateTableQueryMiddleware(path: string): HttpMiddleware {
  return (req, res: Response, next: NextFunction) => {
    const validation = validateTableQuery(req);

    if (!validation.valid) {
      const response = errorResponse(validation.errors, path, "GET");
      res.status(400).json(response);
      return;
    }

    req.validatedTableQuery = validation.params;
    next();
  };
}
