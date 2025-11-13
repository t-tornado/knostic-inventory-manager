import { z } from "zod";
import type { FilterOperator } from "../../../../domain/repositories/filterTypes";
import { createJsonStringValidator } from "../shared/jsonStringValidator";

// Constants
const MIN_PAGE = 1;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 1000;

const filterOperatorSchema = z.enum([
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

const valueSchema = z.union([
  z.string(),
  z.number(),
  z.array(z.union([z.string(), z.number()])),
  z.null(),
]);

function validateArrayValueNotEmpty(data: { value: unknown }): boolean {
  if (Array.isArray(data.value)) {
    return data.value.length > 0;
  }
  return true;
}

function createFilterSchema() {
  return z
    .object({
      field: z.string().min(1, "Field must be a non-empty string"),
      operator: filterOperatorSchema,
      value: valueSchema,
    })
    .refine((data) => validateArrayValueNotEmpty(data), {
      message: "Array values must be non-empty when using array operators",
      path: ["value"],
    });
}

function createSortItemSchema() {
  return z.object({
    id: z.string().min(1, "Sort id must be a non-empty string"),
    direction: z.enum(["asc", "desc"], {
      message: 'Direction must be "asc" or "desc"',
    }),
  });
}

function validatePageNumber(str: string): boolean {
  const num = parseInt(str, 10);
  return !isNaN(num) && num >= MIN_PAGE;
}

function createPageStringSchema() {
  return z
    .string()
    .refine(validatePageNumber, {
      message: `Page must be a valid number greater than or equal to ${MIN_PAGE}`,
    })
    .transform((str) => parseInt(str, 10))
    .optional();
}

function validatePageSizeNumber(str: string): boolean {
  const num = parseInt(str, 10);
  return !isNaN(num) && num >= MIN_PAGE_SIZE && num <= MAX_PAGE_SIZE;
}

function createPageSizeStringSchema() {
  return z
    .string()
    .refine(validatePageSizeNumber, {
      message: `Page size must be a valid number between ${MIN_PAGE_SIZE} and ${MAX_PAGE_SIZE}`,
    })
    .transform((str) => parseInt(str, 10))
    .optional();
}

export const FILTER_SCHEMA = createFilterSchema();
export const SORT_ITEM_SCHEMA = createSortItemSchema();
export const FILTERS_STRING_SCHEMA = createJsonStringValidator(
  z.array(FILTER_SCHEMA),
  "Filters must be valid JSON array with proper filter objects"
);
export const SORT_STRING_SCHEMA = createJsonStringValidator(
  z
    .array(SORT_ITEM_SCHEMA)
    .max(10, "Sort array cannot contain more than 10 items"),
  "Sort must be valid JSON array with proper sort objects (max 10 items)"
);

export const TABLE_QUERY_SCHEMA = z.object({
  search: z.string().min(1, "Search parameter cannot be empty").optional(),
  filters: FILTERS_STRING_SCHEMA,
  sort: SORT_STRING_SCHEMA,
  page: createPageStringSchema(),
  pageSize: createPageSizeStringSchema(),
});
