import { Product, ProductWithStoreName } from "@/core/models/product/model";
import { ProductQueryResult, ProductQueryUpdater } from "../types";
import { nowISO } from "@/shared/utils/date";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allProductsUpdater = (
  updatePayload: Partial<Product>,
  id: string
) => {
  return (old: ProductQueryUpdater) => {
    if (!old) return old;

    const data = old.data as ProductWithStoreName[];
    const updatedData = data.map((product) =>
      product.id === id
        ? {
            ...product,
            ...updatePayload,
            updatedAt: nowISO(),
          }
        : product
    );

    if ("meta" in old) {
      return {
        ...old,
        data: updatedData,
      } as TableResponse;
    }
    return {
      ...old,
      data: updatedData,
    } as ProductQueryResult;
  };
};
