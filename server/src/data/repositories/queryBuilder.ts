import type { Filter } from "../../domain/repositories/filterTypes";
import { buildFilterConditions } from "./filterBuilder";

export interface QueryBuilderOptions {
  searchFields?: string[];
  searchTerm?: string | undefined;
  filters?: string | undefined;
  sort?: string | undefined;
  defaultSort?: string;
  fieldToColumnMap?: Record<string, string>;
}

export interface QueryBuilderResult {
  whereClause: string;
  orderBy: string;
  queryParams: unknown[];
}

/**
 * Reusable query builder for building WHERE and ORDER BY clauses
 * Used by both StoreRepository and ProductRepository
 */
export function buildQuery(options: QueryBuilderOptions): QueryBuilderResult {
  const {
    searchFields = [],
    searchTerm,
    filters,
    sort,
    defaultSort = "ORDER BY created_at DESC",
    fieldToColumnMap = {},
  } = options;

  const conditions: string[] = [];
  const queryParams: unknown[] = [];

  // Build search conditions
  if (searchTerm && searchFields && searchFields.length > 0) {
    const searchClause = `(${searchFields
      .map((field) => {
        const column = fieldToColumnMap[field] || field;
        return `${column} LIKE ?`;
      })
      .join(" OR ")})`;
    conditions.push(searchClause);
    const searchParam = `%${searchTerm}%`;
    queryParams.push(...searchFields.map(() => searchParam));
  }

  // Build filter conditions
  if (filters) {
    try {
      const parsedFilters = JSON.parse(filters) as Filter[];
      const filterConditions = buildFilterConditions(
        parsedFilters,
        queryParams
      );
      if (filterConditions) {
        conditions.push(filterConditions);
      }
    } catch (error) {
      console.error("Failed to parse filters:", error);
    }
  }

  // Build WHERE clause
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Build ORDER BY clause
  let orderBy = defaultSort;
  if (sort) {
    try {
      const sortArray = JSON.parse(sort) as Array<{
        id: string;
        direction: "asc" | "desc";
      }>;
      if (sortArray.length > 0) {
        const sortItem = sortArray[0];
        if (sortItem) {
          const direction = sortItem.direction.toUpperCase();
          const sortField = sortItem.id;
          const column =
            fieldToColumnMap[sortField] ||
            sortField.replace(/([A-Z])/g, "_$1").toLowerCase();
          orderBy = `ORDER BY ${column} ${direction}`;
        }
      }
    } catch (error) {
      console.error("Failed to parse sort:", error);
    }
  }

  return {
    whereClause,
    orderBy,
    queryParams,
  };
}
