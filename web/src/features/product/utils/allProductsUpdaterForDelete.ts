import type { ProductWithStoreName } from "@/core/models/product/model";
import { ProductQueryResult, ProductQueryUpdater } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allProductsUpdaterForDelete = (deletedId: string) => {
  return (old: ProductQueryUpdater) => {
    if (!old) return old;

    const filtered = old.data.filter(
      (product: ProductWithStoreName) => product.id !== deletedId
    );

    if ("meta" in old) {
      return {
        ...old,
        data: filtered,
        meta: {
          ...old.meta,
          total: Math.max(0, (old.meta?.total ?? old.data.length) - 1),
        },
      } as TableResponse;
    } else {
      return {
        ...old,
        data: filtered,
        total: Math.max(0, (old.total ?? old.data.length) - 1),
      } as ProductQueryResult;
    }
  };
};
