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
  getRowId?: (row: any) => string | number;
}

export function TableProvider({
  children,
  config,
  getRowId,
}: TableProviderProps) {
  // Validate configuration
  const validation = validateConfig(config);
  if (!validation.valid) {
    throw new Error(
      `Invalid table configuration: ${validation.errors.join(", ")}`
    );
  }

  // Parse schema
  const parsedSchema = useMemo(
    () => parseSchema(config.schema),
    [config.schema]
  );

  // Create initial columns from schema
  const initialColumns = useMemo(
    () => createColumnsFromSchema(parsedSchema, config.customization),
    [parsedSchema, config.customization]
  );

  // Merge initial state
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
      return {
        ...baseState,
        ...config.initialState,
        // Deep merge for nested objects
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
      };
    }

    return baseState;
  }, [initialColumns, config.initialState]);

  // Initialize reducer
  const [state, dispatch] = useReducer(tableReducer, initialState);

  // Merge config with defaults
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
    }),
    [state, dispatch, parsedSchema, mergedConfig, getRowId]
  );

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}
