import type {
  Product,
  ProductWithStoreName,
} from "@/core/models/product/model";
import { ProductQueryResult, ProductQueryUpdater } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allProductsUpdaterWithServerResponseForCreate = (
  createdProduct: Product
) => {
  return (old: ProductQueryUpdater) => {
    if (!old) return old;

    const productWithStoreName: ProductWithStoreName = {
      ...createdProduct,
      storeName: "",
    };

    const updatedData = old.data.map((p: ProductWithStoreName) =>
      String(p.id).startsWith("temp-") ? productWithStoreName : p
    );

    if (
      !updatedData.some((p: ProductWithStoreName) => p.id === createdProduct.id)
    ) {
      updatedData.unshift(productWithStoreName);
    }

    if ("meta" in old) {
      return {
        ...old,
        data: updatedData,
      } as TableResponse;
    } else {
      return {
        ...old,
        data: updatedData,
      } as ProductQueryResult;
    }
  };
};
