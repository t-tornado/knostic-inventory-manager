import type { Column } from "@/shared/components/BusinessTable";

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

export const renderProductCellValue = (
  column: Column,
  rowData: any
): string => {
  const value = column.accessor(rowData);

  // Format price as currency
  if (column.field === "price") {
    if (value !== null && value !== undefined) {
      return `$${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
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
