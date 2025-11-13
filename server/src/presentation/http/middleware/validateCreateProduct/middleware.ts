import type { Response, NextFunction } from "express";
import type { HttpMiddleware } from "../../IHttpServer";
import { errorResponse } from "../../types";
import { validateCreateProduct } from "./validator";
// To augment the Request type with the validatedCreateProductBody property
import "../shared/types";

export function validateCreateProductMiddleware(path: string): HttpMiddleware {
  return (req, res: Response, next: NextFunction) => {
    const validation = validateCreateProduct(req);

    if (!validation.valid) {
      const response = errorResponse(validation.errors, path, "POST");
      res.status(400).json(response);
      return;
    }

    req.validatedCreateProductBody = validation.body;
    next();
  };
}
