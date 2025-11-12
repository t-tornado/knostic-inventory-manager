import { useTableContext } from "../context/TableContext";
import { selectors } from "../state/selectors";

export function useTableState() {
  const { state, dispatch, schema, config, getRowId, onRowClick } =
    useTableContext();

  return {
    state,
    dispatch,
    schema,
    config,
    getRowId,
    onRowClick,
    visibleColumns: selectors.visibleColumns(state),
    activeFilters: selectors.activeFilters(state),
    hasActiveFilters: selectors.hasActiveFilters(state),
    hasSearch: selectors.hasSearch(state),
    hasSelection: selectors.hasSelection(state),
    selectedCount: selectors.selectedCount(state),
    isGrouped: selectors.isGrouped(state),
  };
}
