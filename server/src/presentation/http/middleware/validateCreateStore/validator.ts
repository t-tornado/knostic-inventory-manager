import { CREATE_STORE_SCHEMA } from "./schemas";
import { mapZodIssuesToErrors } from "../shared/zodErrorMapper";
import type { ValidatedCreateStoreBody } from "./types";

export type ValidationError = ReturnType<typeof mapZodIssuesToErrors>[number];

export interface ValidationResult {
  valid: boolean;
  body: ValidatedCreateStoreBody;
  errors: ValidationError[];
}

function createValidationFailure(errors: ValidationError[]): ValidationResult {
  return {
    valid: false as const,
    body: { name: "" },
    errors,
  };
}

function createValidationSuccess(
  body: ValidatedCreateStoreBody
): ValidationResult {
  return {
    valid: true as const,
    body,
    errors: [],
  };
}

export function validateCreateStore(req: { body: unknown }): ValidationResult {
  const result = CREATE_STORE_SCHEMA.safeParse(req.body);

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
