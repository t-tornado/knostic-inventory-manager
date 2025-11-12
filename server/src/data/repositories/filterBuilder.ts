import type {
  Filter,
  FilterOperator,
} from "../../domain/repositories/filterTypes";

/**
 * Maps frontend field names to database column names
 */
const fieldToColumnMap: Record<string, string> = {
  id: "id",
  name: "name",
  createdAt: "created_at",
  updatedAt: "updated_at",
  stockQuantity: "stock_quantity",
  stock_quantity: "stock_quantity",
  price: "price",
  category: "category",
  storeId: "store_id",
  store_id: "store_id",
  "stores.id": "id",
  "stores.name": "name",
  "stores.createdAt": "created_at",
  "stores.updatedAt": "updated_at",
  "products.id": "id",
  "products.name": "name",
  "products.category": "category",
  "products.stockQuantity": "stock_quantity",
  "products.price": "price",
  "products.createdAt": "created_at",
  "products.updatedAt": "updated_at",
};

/**
 * Gets the database column name for a field
 */
function getColumnName(field: string): string {
  return fieldToColumnMap[field] || field;
}

/**
 * Builds SQL WHERE conditions from filters
 * All filters are combined with AND
 */
export function buildFilterConditions(
  filters: Filter[],
  queryParams: unknown[]
): string {
  if (filters.length === 0) {
    return "";
  }

  const conditions: string[] = [];

  filters.forEach((filter) => {
    const column = getColumnName(filter.field);
    const condition = buildFilterCondition(filter, column, queryParams);
    if (condition) {
      conditions.push(condition);
    }
  });

  return conditions.length > 0 ? conditions.join(" AND ") : "";
}

/**
 * Builds a single filter condition
 */
function buildFilterCondition(
  filter: Filter,
  column: string,
  queryParams: unknown[]
): string {
  const { operator, value } = filter;

  switch (operator) {
    case "equals":
      if (value === null || value === undefined) {
        return `${column} IS NULL`;
      }
      queryParams.push(value);
      return `${column} = ?`;

    case "not_equals":
      if (value === null || value === undefined) {
        return `${column} IS NOT NULL`;
      }
      queryParams.push(value);
      return `${column} != ?`;

    case "contains":
      if (typeof value === "string") {
        queryParams.push(`%${value}%`);
        return `${column} LIKE ?`;
      }
      return "";

    case "not_contains":
      if (typeof value === "string") {
        queryParams.push(`%${value}%`);
        return `${column} NOT LIKE ?`;
      }
      return "";

    case "starts_with":
      if (typeof value === "string") {
        queryParams.push(`${value}%`);
        return `${column} LIKE ?`;
      }
      return "";

    case "ends_with":
      if (typeof value === "string") {
        queryParams.push(`%${value}`);
        return `${column} LIKE ?`;
      }
      return "";

    case "greater_than":
      queryParams.push(value);
      return `${column} > ?`;

    case "less_than":
      queryParams.push(value);
      return `${column} < ?`;

    case "greater_than_or_equal":
      queryParams.push(value);
      return `${column} >= ?`;

    case "less_than_or_equal":
      queryParams.push(value);
      return `${column} <= ?`;

    case "in":
      if (Array.isArray(value) && value.length > 0) {
        const placeholders = value.map(() => "?").join(", ");
        queryParams.push(...value);
        return `${column} IN (${placeholders})`;
      }
      return "";

    case "not_in":
      if (Array.isArray(value) && value.length > 0) {
        const placeholders = value.map(() => "?").join(", ");
        queryParams.push(...value);
        return `${column} NOT IN (${placeholders})`;
      }
      return "";

    case "is_null":
      return `${column} IS NULL`;

    case "is_not_null":
      return `${column} IS NOT NULL`;

    default:
      return "";
  }
}
