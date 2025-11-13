import type {
  Column,
  TableCustomization,
} from "@/shared/components/BusinessTable";
import { formatCurrency } from "@/shared/utils/format";

export const formatProductFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    id: "ID",
    name: "Product Name",
    storeName: "Store",
    category: "Category",
    stockQuantity: "Stock Quantity",
    price: "Price",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };
  return labels[field] || field;
};

export const formatProductFieldLabelWithoutStore = (field: string): string => {
  const labels: Record<string, string> = {
    id: "ID",
    name: "Product Name",
    category: "Category",
    stockQuantity: "Stock Quantity",
    price: "Price",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };
  return labels[field] || field;
};

export const renderProductCellValue = (
  column: Column,
  rowData: any
): string => {
  const value = column.accessor(rowData);

  // Format price as currency
  if (column.field === "price") {
    if (value !== null && value !== undefined) {
      return formatCurrency(Number(value), {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return "-";
  }

  if (column.field === "createdAt" || column.field === "updatedAt") {
    if (value) {
      return new Date(value as string).toLocaleDateString();
    }
  }

  return value ?? "-";
};

/**
 * Creates table customization for product tables
 * @param includeStoreName - Whether to include storeName in field labels (default: true)
 * @returns TableCustomization object
 */
export const createProductTableCustomization = (
  includeStoreName: boolean = true
): TableCustomization => {
  return {
    formatFieldLabel: includeStoreName
      ? formatProductFieldLabel
      : formatProductFieldLabelWithoutStore,
    renderCellValue: renderProductCellValue,
  };
};
