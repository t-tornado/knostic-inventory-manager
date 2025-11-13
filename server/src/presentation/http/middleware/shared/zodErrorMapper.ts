import { z } from "zod";
import { createValidationError } from "../../../../domain/errors";

export interface ErrorMappingConfig {
  defaultField?: string;
  codeMappings?: Partial<Record<string, string>>;
}

const DEFAULT_CODE_MAPPINGS: Record<string, string> = {
  invalid_type: "INVALID_TYPE",
  custom: "INVALID_FORMAT",
  too_small: "MISSING_REQUIRED",
};

function getErrorCode(
  issue: z.ZodIssue,
  customMappings?: Partial<Record<string, string>>
): string {
  const mappings = { ...DEFAULT_CODE_MAPPINGS, ...customMappings };
  return mappings[issue.code] ?? "INVALID_VALUE";
}

function getErrorField(issue: z.ZodIssue, defaultField: string): string {
  return issue.path.length > 0 ? issue.path.join(".") : defaultField;
}

export function mapZodIssuesToErrors(
  issues: z.ZodIssue[],
  config: ErrorMappingConfig = {}
): ReturnType<typeof createValidationError>[] {
  const { defaultField = "validation", codeMappings } = config;

  return issues.map((issue) => {
    const field = getErrorField(issue, defaultField);
    const code = getErrorCode(issue, codeMappings);
    return createValidationError(field, code, issue.message);
  });
}
