import { CREATE_PRODUCT_SCHEMA } from "./schemas";
import { mapZodIssuesToErrors } from "../shared/zodErrorMapper";
import type { ValidatedCreateProductBody } from "./types";

export type ValidationError = ReturnType<typeof mapZodIssuesToErrors>[number];

export interface ValidationResult {
  valid: boolean;
  body: ValidatedCreateProductBody;
  errors: ValidationError[];
}

function createValidationFailure(errors: ValidationError[]): ValidationResult {
  return {
    valid: false as const,
    body: {
      storeId: "",
      name: "",
      category: "",
      stockQuantity: 0,
      price: 0,
    },
    errors,
  };
}

function createValidationSuccess(
  body: ValidatedCreateProductBody
): ValidationResult {
  return {
    valid: true as const,
    body,
    errors: [],
  };
}

export function validateCreateProduct(req: {
  body: unknown;
}): ValidationResult {
  const result = CREATE_PRODUCT_SCHEMA.safeParse(req.body);

  if (!result.success) {
    const errors = mapZodIssuesToErrors(result.error.issues, {
      defaultField: "body",
      codeMappings: {
        too_small: "MISSING_REQUIRED",
      },
    });
    return createValidationFailure(errors);
  }

  return createValidationSuccess(result.data);
}
