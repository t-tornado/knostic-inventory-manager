import type { Column, TableCustomization } from "../../types";
import type { MRT_ColumnDef } from "material-react-table";

/**
 * Transforms BusinessTable Column to MRT Column Definition
 */
export function transformColumnToMRT(
  column: Column,
  customization?: TableCustomization
): MRT_ColumnDef<any> {
  // Use accessorFn if we have a custom accessor, otherwise use accessorKey
  const baseColumn: MRT_ColumnDef<any> = {
    id: column.id,
    header: column.label,
    size: column.width || 150, // Default width if not specified
    minSize: column.minWidth || 80,
    maxSize: column.maxWidth || 500,
    enableSorting: column.sortable !== false,
    enableColumnFilter: false,
  };

  // Use accessorFn for custom accessor logic, accessorKey for simple field access
  if (column.source) {
    // For nested or custom accessors, use accessorFn
    baseColumn.accessorFn = (row) => column.accessor(row);
  } else {
    // For simple field access, use accessorKey (more efficient)
    baseColumn.accessorKey = column.field;
  }

  // Custom cell rendering
  baseColumn.Cell = ({ row }) => {
    // Use customization's renderCellValue if provided
    if (customization?.renderCellValue) {
      return customization.renderCellValue(column, row.original);
    }

    // Fallback to column accessor
    const value = column.accessor(row.original);
    return value ?? "-";
  };

  return baseColumn;
}

/**
 * Transforms multiple BusinessTable Columns to MRT Column Definitions
 */
export function transformColumnsToMRT(
  columns: Column[],
  customization?: TableCustomization
): MRT_ColumnDef<any>[] {
  return columns.map((col) => transformColumnToMRT(col, customization));
}
