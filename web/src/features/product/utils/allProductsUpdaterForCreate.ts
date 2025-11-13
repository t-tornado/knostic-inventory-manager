import type {
  Product,
  ProductWithStoreName,
} from "@/core/models/product/model";
import { ProductQueryResult, ProductQueryUpdater } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";
import { nowISO } from "@/shared/utils/date";
import type { RawProductType } from "../types";

export const allProductsUpdaterForCreate = (newProduct: RawProductType) => {
  return (old: ProductQueryUpdater) => {
    if (!old) return old;

    const optimisticProduct: ProductWithStoreName = {
      id: `temp-${Date.now()}` as Product["id"],
      ...newProduct,
      createdAt: nowISO(),
      updatedAt: nowISO(),
      storeName: "",
    };

    if ("meta" in old) {
      return {
        ...old,
        data: [optimisticProduct, ...old.data],
        meta: {
          ...old.meta,
          total: (old.meta?.total ?? old.data.length) + 1,
        },
      } as TableResponse;
    } else {
      return {
        ...old,
        data: [optimisticProduct, ...old.data],
        total: (old.total ?? old.data.length) + 1,
      } as ProductQueryResult;
    }
  };
};
