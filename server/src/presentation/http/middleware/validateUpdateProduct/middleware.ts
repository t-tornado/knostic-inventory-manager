import type { Response, NextFunction } from "express";
import type { HttpMiddleware } from "../../IHttpServer";
import { errorResponse } from "../../types";
import { validateUpdateProduct } from "./validator";
// To augment the Request type with the validatedUpdateProductBody property
import "../shared/types";

export function validateUpdateProductMiddleware(path: string): HttpMiddleware {
  return (req, res: Response, next: NextFunction) => {
    const validation = validateUpdateProduct(req);

    if (!validation.valid) {
      const response = errorResponse(validation.errors, path, "PUT");
      res.status(400).json(response);
      return;
    }

    req.validatedUpdateProductBody = validation.body;
    next();
  };
}
