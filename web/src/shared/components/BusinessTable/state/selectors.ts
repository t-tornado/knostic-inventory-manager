import type { TableState, Column, Filter } from "../types";

export const selectors = {
  visibleColumns: (state: TableState): Column[] => {
    return state.columns
      .filter((col) => state.columnVisibility[col.id] !== false)
      .sort((a, b) => {
        const aOrder = state.columnOrder.indexOf(a.id);
        const bOrder = state.columnOrder.indexOf(b.id);
        if (aOrder === -1 && bOrder === -1) return 0;
        if (aOrder === -1) return 1;
        if (bOrder === -1) return -1;
        return aOrder - bOrder;
      });
  },

  activeFilters: (state: TableState): Filter[] => {
    return state.filters.filter(
      (f) => f.value !== null && f.value !== undefined && f.value !== ""
    );
  },

  hasActiveFilters: (state: TableState): boolean => {
    return state.filters.length > 0 || state.filterGroups.length > 0;
  },

  hasSearch: (state: TableState): boolean => {
    return state.searchKeyword.trim().length > 0;
  },

  hasSelection: (state: TableState): boolean => {
    return state.selection.selectedRows.size > 0;
  },

  selectedCount: (state: TableState): number => {
    return state.selection.selectedRows.size;
  },

  isGrouped: (state: TableState): boolean => {
    return state.grouping.groupBy.length > 0;
  },
};
