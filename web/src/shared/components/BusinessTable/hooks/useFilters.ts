import { useMemo } from "react";
import { useTableState } from "./useTableState";
import { filterActions } from "../state/actions";
import type { Filter, FilterOperator } from "../types";

export function useFilters() {
  const { state, dispatch, schema } = useTableState();

  const addFilter = (filter: Omit<Filter, "id">) => {
    const newFilter: Filter = {
      ...filter,
      id: `filter-${Date.now()}-${Math.random()}`,
    };
    dispatch(filterActions.add(newFilter));
  };

  const removeFilter = (id: string) => {
    dispatch(filterActions.remove(id));
  };

  const updateFilter = (id: string, updates: Partial<Filter>) => {
    dispatch(filterActions.update(id, updates));
  };

  const clearFilters = () => {
    dispatch(filterActions.clear());
  };

  const filterableFields = useMemo(() => {
    return schema.fields.filter((field) => field.valueTypes.length > 0);
  }, [schema]);

  const getFieldValues = (fieldKey: string) => {
    const field = schema.fieldMap.get(fieldKey);
    return field?.values || [];
  };

  const getOperatorsForField = (fieldKey: string): FilterOperator[] => {
    const field = schema.fieldMap.get(fieldKey);
    if (!field) return [];

    const valueTypes = field.valueTypes;
    const operators: FilterOperator[] = [];

    if (valueTypes.includes("string")) {
      operators.push(
        "equals",
        "not_equals",
        "contains",
        "not_contains",
        "starts_with",
        "ends_with",
        "is_null",
        "is_not_null"
      );
    }
    if (valueTypes.includes("number")) {
      operators.push(
        "equals",
        "not_equals",
        "greater_than",
        "less_than",
        "greater_than_or_equal",
        "less_than_or_equal",
        "in",
        "not_in",
        "is_null",
        "is_not_null"
      );
    }
    if (valueTypes.includes("enum") || valueTypes.includes("select")) {
      operators.push(
        "equals",
        "not_equals",
        "in",
        "not_in",
        "is_null",
        "is_not_null"
      );
    }

    return operators.length > 0 ? operators : ["equals", "not_equals"];
  };

  return {
    filters: state.filters,
    filterGroups: state.filterGroups,
    activeFilters: state.filters.filter(
      (f) => f.value !== null && f.value !== undefined && f.value !== ""
    ),
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    filterableFields,
    getFieldValues,
    getOperatorsForField,
  };
}
