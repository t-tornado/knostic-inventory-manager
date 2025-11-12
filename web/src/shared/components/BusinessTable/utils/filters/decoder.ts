import type { Filter, TableRequestParams } from "../../types";

/**
 * Decodes request params back into Filter objects
 */
export function decodeParamsToFilters(params: TableRequestParams): Filter[] {
  if (!params.filters) {
    return [];
  }

  try {
    const filters = JSON.parse(params.filters) as (
      | Filter
      | Omit<Filter, "id">
    )[];
    return filters.map((filter, index) => ({
      ...filter,
      id: "id" in filter && filter.id ? filter.id : `filter-${index}`,
    }));
  } catch (error) {
    console.error("Failed to decode filters:", error);
    return [];
  }
}

/**
 * Decodes sort params back into ColumnSort objects
 */
export function decodeParamsToSorting(params: TableRequestParams) {
  if (!params.sort) {
    return [];
  }

  try {
    return JSON.parse(params.sort);
  } catch (error) {
    console.error("Failed to decode sorting:", error);
    return [];
  }
}

/**
 * Decodes groupBy params
 */
export function decodeParamsToGroupBy(params: TableRequestParams): string[] {
  if (!params.groupBy) {
    return [];
  }

  try {
    return JSON.parse(params.groupBy);
  } catch (error) {
    console.error("Failed to decode groupBy:", error);
    return [];
  }
}

/**
 * Decodes columns params
 */
export function decodeParamsToColumns(params: TableRequestParams): string[] {
  if (!params.columns) {
    return [];
  }

  try {
    return JSON.parse(params.columns);
  } catch (error) {
    console.error("Failed to decode columns:", error);
    return [];
  }
}
