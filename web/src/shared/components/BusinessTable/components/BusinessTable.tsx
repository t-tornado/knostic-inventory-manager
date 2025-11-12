import { forwardRef } from "react";
import { TableProvider } from "../context";
import type { BusinessTableProps, BusinessTableHandle } from "../types";
import { BusinessTableInner } from "./BusinessTableInner";

export const BusinessTable = forwardRef<
  BusinessTableHandle,
  BusinessTableProps
>((props, ref) => {
  const { onFiltersChange, getRowId, onRowClick, ...config } = props;

  return (
    <TableProvider config={config} getRowId={getRowId} onRowClick={onRowClick}>
      <BusinessTableInner onFiltersChange={onFiltersChange} tableRef={ref} />
    </TableProvider>
  );
});

BusinessTable.displayName = "BusinessTable";
