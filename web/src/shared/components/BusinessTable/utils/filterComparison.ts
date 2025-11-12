import type { Filter } from "../types";

export function haveFiltersChanged(
  currentFilters: Filter[],
  previousFilters: Filter[]
): boolean {
  if (currentFilters.length !== previousFilters.length) {
    return true;
  }

  return currentFilters.some((filter, index) => {
    const prevFilter = previousFilters[index];
    if (!prevFilter) return true;

    return (
      filter.id !== prevFilter.id ||
      filter.field !== prevFilter.field ||
      filter.operator !== prevFilter.operator ||
      filter.source !== prevFilter.source ||
      JSON.stringify(filter.value) !== JSON.stringify(prevFilter.value)
    );
  });
}
