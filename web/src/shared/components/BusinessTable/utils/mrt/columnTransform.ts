import type { ReactNode } from "react";
import type { Column, TableCustomization } from "../../types";
import type { MRT_ColumnDef, MRT_RowData } from "material-react-table";

export function transformColumnToMRT(
  column: Column,
  customization?: TableCustomization
): MRT_ColumnDef<MRT_RowData> {
  const baseColumn: MRT_ColumnDef<MRT_RowData> = {
    id: column.id,
    header: column.label,
    size: column.width || 150,
    minSize: column.minWidth || 80,
    maxSize: column.maxWidth || 500,
    enableSorting: column.sortable !== false,
    enableColumnFilter: false,
  };

  if (column.source) {
    baseColumn.accessorFn = (row) => column.accessor(row);
  } else {
    baseColumn.accessorKey = column.field;
  }

  baseColumn.Cell = ({ row }): ReactNode => {
    if (customization?.renderCellValue) {
      return customization.renderCellValue(column, row.original);
    }

    const value = column.accessor(row.original);
    if (value === null || value === undefined) {
      return "-";
    }
    return String(value);
  };

  return baseColumn;
}

export function transformColumnsToMRT(
  columns: Column[],
  customization?: TableCustomization
): MRT_ColumnDef<MRT_RowData>[] {
  return columns.map((col) => transformColumnToMRT(col, customization));
}
