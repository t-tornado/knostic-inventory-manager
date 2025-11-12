import { createContext, useContext } from "react";
import type {
  TableState,
  TableAction,
  ParsedSchema,
  TableConfig,
} from "../types";

export interface TableContextValue {
  state: TableState;
  dispatch: React.Dispatch<TableAction>;
  schema: ParsedSchema;
  config: Required<TableConfig>;
  getRowId?: (row: any) => string | number;
  onRowClick?: (row: any) => void;
}

export const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext(): TableContextValue {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within TableProvider");
  }
  return context;
}
