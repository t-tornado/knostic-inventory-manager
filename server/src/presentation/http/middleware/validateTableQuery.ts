import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import type { HttpMiddleware } from "../IHttpServer";
import { errorResponse } from "../types";
import { createValidationError } from "../../../domain/errors";
import type { FilterOperator } from "../../../domain/repositories/filterTypes";

export interface ValidatedTableQueryParams {
  search?: string;
  filters?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

const VALID_FILTER_OPERATORS: FilterOperator[] = [
  "equals",
  "not_equals",
  "contains",
  "not_contains",
  "starts_with",
  "ends_with",
  "greater_than",
  "less_than",
  "greater_than_or_equal",
  "less_than_or_equal",
  "in",
  "not_in",
  "is_null",
  "is_not_null",
];

const MIN_PAGE = 1;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 1000;

const FilterOperatorSchema = z.enum([
  "equals",
  "not_equals",
  "contains",
  "not_contains",
  "starts_with",
  "ends_with",
  "greater_than",
  "less_than",
  "greater_than_or_equal",
  "less_than_or_equal",
  "in",
  "not_in",
  "is_null",
  "is_not_null",
] as [FilterOperator, ...FilterOperator[]]);

const FilterValueSchema = z.union([
  z.string(),
  z.number(),
  z.array(z.union([z.string(), z.number()])),
  z.null(),
]);

const FilterSchema = z
  .object({
    field: z.string().min(1, "Field must be a non-empty string"),
    operator: FilterOperatorSchema,
    value: FilterValueSchema,
  })
  .refine(
    (data) => {
      if (Array.isArray(data.value)) {
        return data.value.length > 0;
      }
      return true;
    },
    {
      message: "Array values must be non-empty when using array operators",
      path: ["value"],
    }
  );

const SortItemSchema = z.object({
  id: z.string().min(1, "Sort id must be a non-empty string"),
  direction: z.enum(["asc", "desc"], {
    message: 'Direction must be "asc" or "desc"',
  }),
});

const FiltersStringSchema = z
  .string()
  .refine(
    (str) => {
      try {
        const parsed = JSON.parse(str);
        const result = z.array(FilterSchema).safeParse(parsed);
        return result.success;
      } catch {
        return false;
      }
    },
    {
      message: "Filters must be valid JSON array with proper filter objects",
    }
  )
  .optional();

const SortStringSchema = z
  .string()
  .refine(
    (str) => {
      try {
        const parsed = JSON.parse(str);
        const result = z
          .array(SortItemSchema)
          .max(10, "Sort array cannot contain more than 10 items")
          .safeParse(parsed);
        return result.success;
      } catch {
        return false;
      }
    },
    {
      message:
        "Sort must be valid JSON array with proper sort objects (max 10 items)",
    }
  )
  .optional();

const PageStringSchema = z
  .string()
  .refine(
    (str) => {
      const num = parseInt(str, 10);
      return !isNaN(num) && num >= MIN_PAGE;
    },
    {
      message: `Page must be a valid number greater than or equal to ${MIN_PAGE}`,
    }
  )
  .transform((str) => parseInt(str, 10))
  .optional();

const PageSizeStringSchema = z
  .string()
  .refine(
    (str) => {
      const num = parseInt(str, 10);
      return !isNaN(num) && num >= MIN_PAGE_SIZE && num <= MAX_PAGE_SIZE;
    },
    {
      message: `Page size must be a valid number between ${MIN_PAGE_SIZE} and ${MAX_PAGE_SIZE}`,
    }
  )
  .transform((str) => parseInt(str, 10))
  .optional();

const TableQuerySchema = z.object({
  search: z.string().min(1, "Search parameter cannot be empty").optional(),
  filters: FiltersStringSchema,
  sort: SortStringSchema,
  page: PageStringSchema,
  pageSize: PageSizeStringSchema,
});

export function validateTableQuery(
  req: Request,
  res: Response,
  path: string
): { valid: boolean; params: ValidatedTableQueryParams; errors: any[] } {
  const queryParams: Record<string, string> = {};

  if (req.query.search !== undefined) {
    if (typeof req.query.search === "string") {
      queryParams.search = req.query.search;
    }
  }
  if (req.query.filters !== undefined) {
    if (typeof req.query.filters === "string") {
      queryParams.filters = req.query.filters;
    }
  }
  if (req.query.sort !== undefined) {
    if (typeof req.query.sort === "string") {
      queryParams.sort = req.query.sort;
    }
  }
  if (req.query.page !== undefined) {
    if (typeof req.query.page === "string") {
      queryParams.page = req.query.page;
    }
  }
  if (req.query.pageSize !== undefined) {
    if (typeof req.query.pageSize === "string") {
      queryParams.pageSize = req.query.pageSize;
    }
  }

  const result = TableQuerySchema.safeParse(queryParams);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join(".") : "query";
      let code = "INVALID_VALUE";
      if (issue.code === z.ZodIssueCode.invalid_type) {
        code = "INVALID_TYPE";
      } else if (issue.code === z.ZodIssueCode.custom) {
        code = "INVALID_FORMAT";
      }
      return createValidationError(field, code, issue.message);
    });
    return { valid: false, params: {}, errors };
  }

  return {
    valid: true,
    params: result.data as ValidatedTableQueryParams,
    errors: [],
  };
}

export function validateTableQueryMiddleware(path: string): HttpMiddleware {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = validateTableQuery(req, res, path);

    if (!validation.valid) {
      const response = errorResponse(validation.errors, path, "GET");
      res.status(400).json(response);
      return;
    }

    (req as any).validatedTableQuery = validation.params;
    next();
  };
}
