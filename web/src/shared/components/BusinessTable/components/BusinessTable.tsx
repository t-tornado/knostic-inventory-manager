import { forwardRef } from "react";
import { TableProvider } from "../context";
import type { BusinessTableProps, BusinessTableHandle } from "../types";
import { BusinessTableInner } from "./BusinessTableInner";

export const BusinessTable = forwardRef<
  BusinessTableHandle,
  BusinessTableProps
>((props, ref) => {
  const { onFiltersChange, onStateChange, getRowId, onRowClick, ...config } =
    props;

  return (
    <TableProvider
      config={config}
      getRowId={getRowId as ((row: unknown) => string | number) | undefined}
      onRowClick={onRowClick}
    >
      <BusinessTableInner
        onFiltersChange={onFiltersChange}
        onStateChange={onStateChange}
        tableRef={ref}
      />
    </TableProvider>
  );
});

BusinessTable.displayName = "BusinessTable";
