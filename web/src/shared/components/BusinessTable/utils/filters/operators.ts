import type { FilterOperator } from "../../types";

/**
 * Maps value types to available operators
 */
export const operatorsByType: Record<string, FilterOperator[]> = {
  string: [
    "equals",
    "not_equals",
    "contains",
    "not_contains",
    "starts_with",
    "ends_with",
    "is_null",
    "is_not_null",
  ],
  number: [
    "equals",
    "not_equals",
    "greater_than",
    "less_than",
    "greater_than_or_equal",
    "less_than_or_equal",
    "in",
    "not_in",
    "is_null",
    "is_not_null",
  ],
  date: [
    "equals",
    "not_equals",
    "greater_than",
    "less_than",
    "greater_than_or_equal",
    "less_than_or_equal",
    "is_null",
    "is_not_null",
  ],
  enum: ["equals", "not_equals", "in", "not_in", "is_null", "is_not_null"],
  select: ["equals", "not_equals", "in", "not_in", "is_null", "is_not_null"],
  boolean: ["equals", "not_equals", "is_null", "is_not_null"],
};

/**
 * Get available operators for a field based on its value types
 */
export function getOperatorsForField(valueTypes: string[]): FilterOperator[] {
  if (!valueTypes || valueTypes.length === 0) {
    // Default to string operators
    return operatorsByType.string;
  }

  // Get operators for all types and merge (remove duplicates)
  const allOperators = new Set<FilterOperator>();

  for (const type of valueTypes) {
    const normalizedType = type.toLowerCase();
    const operators = operatorsByType[normalizedType] || operatorsByType.string;
    operators.forEach((op) => allOperators.add(op));
  }

  // If no operators found, default to string
  if (allOperators.size === 0) {
    return operatorsByType.string;
  }

  return Array.from(allOperators);
}

/**
 * Get operator label for display
 */
export function getOperatorLabel(operator: FilterOperator): string {
  const labels: Record<FilterOperator, string> = {
    equals: "Equals",
    not_equals: "Not Equals",
    contains: "Contains",
    not_contains: "Not Contains",
    starts_with: "Starts With",
    ends_with: "Ends With",
    greater_than: "Greater Than",
    less_than: "Less Than",
    greater_than_or_equal: "Greater Than or Equal",
    less_than_or_equal: "Less Than or Equal",
    in: "In",
    not_in: "Not In",
    is_null: "Is Null",
    is_not_null: "Is Not Null",
  };

  return labels[operator] || operator;
}

/**
 * Check if a field type is a date type
 */
export function isDateField(valueTypes: string[]): boolean {
  return valueTypes.some(
    (type) => type.toLowerCase() === "date" || type.toLowerCase() === "datetime"
  );
}

/**
 * Check if a field type is a number type
 */
export function isNumberField(valueTypes: string[]): boolean {
  return valueTypes.some((type) => type.toLowerCase() === "number");
}

/**
 * Check if a field type is an enum/select type
 */
export function isEnumField(valueTypes: string[]): boolean {
  return valueTypes.some(
    (type) =>
      type.toLowerCase() === "enum" ||
      type.toLowerCase() === "select" ||
      type.toLowerCase() === "choice"
  );
}
