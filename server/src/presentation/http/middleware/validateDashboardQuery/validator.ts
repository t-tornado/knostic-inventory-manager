import { DASHBOARD_QUERY_SCHEMA, ACTIVITY_QUERY_SCHEMA } from "./schemas";
import { mapZodIssuesToErrors } from "../shared/zodErrorMapper";
import type {
  ValidatedDashboardQueryParams,
  ValidatedActivityQueryParams,
} from "./types";

export type ValidationError = ReturnType<typeof mapZodIssuesToErrors>[number];

export interface DashboardValidationResult {
  valid: boolean;
  params: ValidatedDashboardQueryParams;
  errors: ValidationError[];
}

export interface ActivityValidationResult {
  valid: boolean;
  params: ValidatedActivityQueryParams;
  errors: ValidationError[];
}

function createDashboardValidationFailure(
  errors: ValidationError[]
): DashboardValidationResult {
  return {
    valid: false as const,
    params: {},
    errors,
  };
}

function createDashboardValidationSuccess(
  params: ValidatedDashboardQueryParams
): DashboardValidationResult {
  return {
    valid: true as const,
    params,
    errors: [],
  };
}

function createActivityValidationFailure(
  errors: ValidationError[]
): ActivityValidationResult {
  return {
    valid: false as const,
    params: {},
    errors,
  };
}

function createActivityValidationSuccess(
  params: ValidatedActivityQueryParams
): ActivityValidationResult {
  return {
    valid: true as const,
    params,
    errors: [],
  };
}

export function validateDashboardQuery(req: {
  query: Record<string, unknown>;
}): DashboardValidationResult {
  const result = DASHBOARD_QUERY_SCHEMA.safeParse(req.query);

  if (!result.success) {
    const errors = mapZodIssuesToErrors(result.error.issues, {
      defaultField: "query",
    });
    return createDashboardValidationFailure(errors);
  }

  return createDashboardValidationSuccess(result.data);
}

export function validateActivityQuery(req: {
  query: Record<string, unknown>;
}): ActivityValidationResult {
  const result = ACTIVITY_QUERY_SCHEMA.safeParse(req.query);

  if (!result.success) {
    const errors = mapZodIssuesToErrors(result.error.issues, {
      defaultField: "query",
    });
    return createActivityValidationFailure(errors);
  }

  return createActivityValidationSuccess(result.data);
}
