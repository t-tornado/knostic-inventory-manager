import { UPDATE_PRODUCT_SCHEMA } from "./schemas";
import { mapZodIssuesToErrors } from "../shared/zodErrorMapper";
import type { ValidatedUpdateProductBody } from "./types";

export type ValidationError = ReturnType<typeof mapZodIssuesToErrors>[number];

export interface ValidationResult {
  valid: boolean;
  body: ValidatedUpdateProductBody;
  errors: ValidationError[];
}

function createValidationFailure(errors: ValidationError[]): ValidationResult {
  return {
    valid: false as const,
    body: {},
    errors,
  };
}

function createValidationSuccess(
  body: Partial<ValidatedUpdateProductBody>
): ValidationResult {
  return {
    valid: true as const,
    body,
    errors: [],
  };
}

export function validateUpdateProduct(req: {
  body: unknown;
}): ValidationResult {
  const result = UPDATE_PRODUCT_SCHEMA.safeParse(req.body);

  if (!result.success) {
    const errors = mapZodIssuesToErrors(result.error.issues, {
      defaultField: "body",
      codeMappings: {
        too_small: "INVALID_VALUE",
      },
    });
    return createValidationFailure(errors);
  }

  return createValidationSuccess(
    result.data as Partial<ValidatedUpdateProductBody>
  );
}
