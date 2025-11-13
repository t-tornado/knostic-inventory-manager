import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import type { HttpMiddleware } from "../IHttpServer";
import { errorResponse } from "../types";
import { createValidationError } from "../../../domain/errors";

const CreateStoreSchema = z.object({
  name: z
    .string({
      message: "Store name must be a string",
    })
    .min(1, "Store name cannot be empty")
    .trim(),
});

export interface ValidatedCreateStoreBody {
  name: string;
}

export function validateCreateStore(
  req: Request,
  res: Response,
  path: string
): { valid: boolean; body: ValidatedCreateStoreBody; errors: any[] } {
  const result = CreateStoreSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join(".") : "body";
      let code = "INVALID_VALUE";
      if (issue.code === z.ZodIssueCode.invalid_type) {
        code = "INVALID_TYPE";
      } else if (issue.code === z.ZodIssueCode.too_small) {
        code = "MISSING_REQUIRED";
      }
      return createValidationError(field, code, issue.message);
    });
    return { valid: false, body: { name: "" }, errors };
  }

  return {
    valid: true,
    body: result.data,
    errors: [],
  };
}

export function validateCreateStoreMiddleware(path: string): HttpMiddleware {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = validateCreateStore(req, res, path);

    if (!validation.valid) {
      const response = errorResponse(validation.errors, path, "POST");
      res.status(400).json(response);
      return;
    }

    (req as any).validatedCreateStoreBody = validation.body;
    next();
  };
}
