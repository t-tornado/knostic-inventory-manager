import type { Response, NextFunction } from "express";
import type { HttpMiddleware } from "../../IHttpServer";
import { errorResponse } from "../../types";
import { validateUpdateStore } from "./validator";
// To augment the Request type with the validatedUpdateStoreBody property
import "../shared/types";

export function validateUpdateStoreMiddleware(path: string): HttpMiddleware {
  return (req, res: Response, next: NextFunction) => {
    const validation = validateUpdateStore(req);

    if (!validation.valid) {
      const response = errorResponse(validation.errors, path, "PUT");
      res.status(400).json(response);
      return;
    }

    req.validatedUpdateStoreBody = validation.body;
    next();
  };
}
