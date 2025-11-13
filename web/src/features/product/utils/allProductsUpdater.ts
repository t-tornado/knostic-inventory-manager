import { Product } from "@/core/models/product/model";
import { ProductQueryResult, ProductQueryUpdater } from "../types";
import { nowISO } from "@/shared/utils/date";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allProductsUpdater = (
  updatePayload: Partial<Product>,
  id: string
) => {
  return (old: ProductQueryUpdater) => {
    if (!old) return old;

    const updatedData = old.data.map((product: Product) =>
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
