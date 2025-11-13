import { z } from "zod";
import { TABLE_QUERY_SCHEMA } from "./schemas";
import { extractQueryParams } from "./extractors";
import { mapZodIssuesToErrors } from "../shared/zodErrorMapper";
import { ValidatedTableQueryParams } from "../../types";

export type ValidationError = ReturnType<typeof mapZodIssuesToErrors>[number];

export interface ValidationResult {
  valid: boolean;
  params: ValidatedTableQueryParams;
  errors: ValidationError[];
}

function createValidationFailure(errors: z.ZodIssue[]): ValidationResult {
  return {
    valid: false as const,
    params: {} as ValidatedTableQueryParams,
    errors: mapZodIssuesToErrors(errors, { defaultField: "query" }),
  };
}

function createValidationSuccess(
  params: ValidatedTableQueryParams
): ValidationResult {
  return {
    valid: true as const,
    params,
    errors: [],
  };
}

export function validateTableQuery(req: {
  query: Record<string, unknown>;
}): ValidationResult {
  const queryParams = extractQueryParams(req);
  const result = TABLE_QUERY_SCHEMA.safeParse(queryParams);

  if (!result.success) {
    return createValidationFailure(result.error.issues);
  }

  return createValidationSuccess(result.data);
}
