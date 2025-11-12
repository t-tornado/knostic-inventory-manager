import type { TableState, TableAction } from "../types";
import { defaultTableState } from "../config/defaults";

export function tableReducer(
  state: TableState,
  action: TableAction
): TableState {
  switch (action.type) {
    // ========================================================================
    // Filter Actions
    // ========================================================================
    case "FILTER_ADD": {
      return {
        ...state,
        filters: [...state.filters, action.payload],
      };
    }

    case "FILTER_REMOVE": {
      return {
        ...state,
        filters: state.filters.filter((f) => f.id !== action.payload),
      };
    }

    case "FILTER_UPDATE": {
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.id === action.payload.id ? { ...f, ...action.payload.filter } : f
        ),
      };
    }

    case "FILTER_CLEAR": {
      return {
        ...state,
        filters: [],
        filterGroups: [],
      };
    }

    case "FILTER_GROUP_ADD": {
      return {
        ...state,
        filterGroups: [...state.filterGroups, action.payload],
      };
    }

    case "FILTER_GROUP_REMOVE": {
      return {
        ...state,
        filterGroups: state.filterGroups.filter((g) => g.id !== action.payload),
      };
    }

    // ========================================================================
    // Column Actions
    // ========================================================================
    case "COLUMN_TOGGLE": {
      const columnId = action.payload;
      return {
        ...state,
        columnVisibility: {
          ...state.columnVisibility,
          [columnId]: !state.columnVisibility[columnId],
        },
      };
    }

    case "COLUMN_REORDER": {
      const { from, to } = action.payload;
      const newOrder = [...state.columnOrder];
      const [moved] = newOrder.splice(from, 1);
      newOrder.splice(to, 0, moved);
      return {
        ...state,
        columnOrder: newOrder,
      };
    }

    case "COLUMN_SORT": {
      const existingIndex = state.columnSorting.findIndex(
        (s) => s.id === action.payload.id
      );
      if (existingIndex >= 0) {
        // Update existing sort
        const newSorting = [...state.columnSorting];
        newSorting[existingIndex] = action.payload;
        return {
          ...state,
          columnSorting: newSorting,
        };
      }
      // Add new sort
      return {
        ...state,
        columnSorting: [...state.columnSorting, action.payload],
      };
    }

    case "COLUMN_SORT_CLEAR": {
      return {
        ...state,
        columnSorting: [],
      };
    }

    case "COLUMN_RESIZE": {
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.payload.id
            ? { ...col, width: action.payload.width }
            : col
        ),
      };
    }

    // ========================================================================
    // Search Actions
    // ========================================================================
    case "SEARCH_SET": {
      return {
        ...state,
        searchKeyword: action.payload,
        pagination: {
          ...state.pagination,
          pageIndex: 0, // Reset to first page on search
        },
      };
    }

    case "SEARCH_TYPE_SET": {
      return {
        ...state,
        searchType: action.payload,
      };
    }

    // ========================================================================
    // Pagination Actions
    // ========================================================================
    case "PAGINATION_SET": {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };
    }

    // ========================================================================
    // Selection Actions
    // ========================================================================
    case "SELECTION_TOGGLE": {
      const newSelected = new Set(state.selection.selectedRows);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedRows: newSelected,
        },
      };
    }

    case "SELECTION_SELECT_ALL": {
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedRows: action.payload
            ? new Set() // Will be populated by component
            : new Set(),
        },
      };
    }

    case "SELECTION_CLEAR": {
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedRows: new Set(),
        },
      };
    }

    // ========================================================================
    // Grouping Actions
    // ========================================================================
    case "GROUPING_SET": {
      return {
        ...state,
        grouping: {
          ...state.grouping,
          groupBy: action.payload,
        },
      };
    }

    case "GROUPING_TOGGLE": {
      const newExpanded = new Set(state.grouping.expanded);
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload);
      } else {
        newExpanded.add(action.payload);
      }
      return {
        ...state,
        grouping: {
          ...state.grouping,
          expanded: newExpanded,
        },
      };
    }

    // ========================================================================
    // State Management Actions
    // ========================================================================
    case "STATE_RESET": {
      return defaultTableState;
    }

    case "STATE_RESTORE": {
      return {
        ...state,
        ...action.payload,
      };
    }

    default: {
      return state;
    }
  }
}
