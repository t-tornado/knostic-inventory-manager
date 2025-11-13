import type { Response, NextFunction } from "express";
import type { HttpMiddleware } from "../../IHttpServer";
import { errorResponse } from "../../types";
import { validateCreateStore } from "./validator";
// To augment the Request type with the validatedCreateStoreBody property
import "../shared/types";

export function validateCreateStoreMiddleware(path: string): HttpMiddleware {
  return (req, res: Response, next: NextFunction) => {
    const validation = validateCreateStore(req);

    if (!validation.valid) {
      const response = errorResponse(validation.errors, path, "POST");
      res.status(400).json(response);
      return;
    }

    req.validatedCreateStoreBody = validation.body;
    next();
  };
}

