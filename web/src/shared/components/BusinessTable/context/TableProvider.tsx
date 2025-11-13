import { useReducer, useMemo } from "react";
import { TableContext, type TableContextValue } from "./TableContext";
import type { TableConfig } from "../types";
import { tableReducer } from "../state/reducer";
import { defaultTableState, defaultFeatures } from "../config/defaults";
import { parseSchema } from "../utils/schema";
import { createColumnsFromSchema } from "../utils/schema/columns";
import { validateConfig } from "../config/validators";

interface TableProviderProps {
  children: React.ReactNode;
  config: TableConfig;
  getRowId?: (row: unknown) => string | number;
  onRowClick?: (row: unknown) => void;
}

export function TableProvider({
  children,
  config,
  getRowId,
  onRowClick,
}: TableProviderProps) {
  const validation = validateConfig(config);
  if (!validation.valid) {
    throw new Error(
      `Invalid table configuration: ${validation.errors.join(", ")}`
    );
  }

  const parsedSchema = useMemo(
    () => parseSchema(config.schema),
    [config.schema]
  );

  const initialColumns = useMemo(
    () => createColumnsFromSchema(parsedSchema, config.customization),
    [parsedSchema, config.customization]
  );

  const initialState = useMemo(() => {
    const baseState = {
      ...defaultTableState,
      columns: initialColumns,
      columnOrder: initialColumns.map((col) => col.id),
      columnVisibility: initialColumns.reduce(
        (acc, col) => ({
          ...acc,
          [col.id]: col.visible !== false,
        }),
        {}
      ),
    };

    if (config.initialState) {
      let columnVisibility = baseState.columnVisibility;
      const urlColumnVisibility = config.initialState.columnVisibility;
      if (urlColumnVisibility) {
        columnVisibility = initialColumns.reduce((acc, col) => {
          acc[col.id] = urlColumnVisibility[col.id] === true;
          return acc;
        }, {} as Record<string, boolean>);
      }

      return {
        ...baseState,
        ...config.initialState,
        columnVisibility,
        pagination: {
          ...baseState.pagination,
          ...config.initialState.pagination,
        },
        selection: {
          ...baseState.selection,
          ...config.initialState.selection,
        },
        grouping: {
          ...baseState.grouping,
          ...config.initialState.grouping,
        },
        filters: config.initialState.filters ?? baseState.filters,
        columnSorting:
          config.initialState.columnSorting ?? baseState.columnSorting,
      };
    }

    return baseState;
  }, [initialColumns, config.initialState]);

  const [state, dispatch] = useReducer(tableReducer, initialState);

  const mergedConfig = useMemo(
    () => ({
      ...config,
      features: {
        ...defaultFeatures,
        ...config.features,
      },
    }),
    [config]
  ) as Required<TableConfig>;

  const value: TableContextValue = useMemo(
    () => ({
      state,
      dispatch,
      schema: parsedSchema,
      config: mergedConfig,
      getRowId,
      onRowClick,
    }),
    [state, dispatch, parsedSchema, mergedConfig, getRowId, onRowClick]
  );

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}
