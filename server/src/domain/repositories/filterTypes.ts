/**
 * Filter types for query parameters
 * These match the frontend Filter interface
 */

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal"
  | "in"
  | "not_in"
  | "is_null"
  | "is_not_null";

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: string | number | (string | number)[] | null;
}
