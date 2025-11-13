import { MRT_RowData } from "material-react-table";
import type { ParsedSchema, Column, TableCustomization } from "../../types";

export function createColumnsFromSchema(
  schema: ParsedSchema,
  customization?: TableCustomization
): Column[] {
  const formatLabel =
    customization?.formatFieldLabel ||
    ((field: string) =>
      field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));

  return schema.fields.map((field, index) => {
    const getDefaultWidth = (fieldName: string, valueTypes: string[]) => {
      if (fieldName === "id") return 80;
      if (valueTypes.includes("date")) return 150;
      if (fieldName.includes("name") || fieldName.includes("title")) return 200;
      return 150;
    };

    return {
      id: field.fullKey,
      field: field.field,
      source: field.source,
      label: formatLabel(field.field, field.source),
      width: getDefaultWidth(field.field, field.valueTypes),
      minWidth: 80,
      accessor: (row: MRT_RowData) => {
        if (row?.[field.field] !== undefined) {
          return row[field.field];
        }

        const keys = field.fullKey.split(".");
        let value = row;
        for (const key of keys) {
          value = value?.[key];
          if (value === undefined) break;
        }
        return value;
      },
      sortable: true,
      filterable: true,
      visible: index < 10, // Show first 10 columns by default
      order: index,
    };
  });
}

export function getColumnByField(
  columns: Column[],
  field: string,
  source?: string
): Column | undefined {
  if (source) {
    return columns.find((col) => col.field === field && col.source === source);
  }
  return columns.find((col) => col.field === field);
}

export function getVisibleColumns(columns: Column[]): Column[] {
  return columns
    .filter((col) => col.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}
