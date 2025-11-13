import type { Column, TableRowData } from "@/shared/components/BusinessTable";
import type { Store } from "@/core/models/store/model";
import { StoreId } from "../components/atoms";

export const formatStoreFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    id: "ID",
    name: "Store Name",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };
  return labels[field] || field;
};

export const createRenderStoreCellValue = (
  onStoreIdClick?: (e: React.MouseEvent<HTMLDivElement>, store: Store) => void
) => {
  return (column: Column, rowData: TableRowData): string | React.ReactNode => {
    const value = column.accessor(rowData) as string;

    if (column.field === "createdAt" || column.field === "updatedAt") {
      if (value) {
        return new Date(value as string).toLocaleDateString();
      }
    }

    if (column.field === "id") {
      return (
        <StoreId
          isLink={!!onStoreIdClick}
          onClick={
            onStoreIdClick
              ? (e) => onStoreIdClick(e, rowData as unknown as Store)
              : undefined
          }
        >
          {value}
        </StoreId>
      );
    }

    return value ?? "-";
  };
};
