import type {
  Product,
  ProductWithStoreName,
} from "@/core/models/product/model";
import { ProductQueryResult, ProductQueryUpdater } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allProductsUpdaterWithServerResponse = (
  updatedProduct: Product
) => {
  return (old: ProductQueryUpdater) => {
    if (!old) return old;

    const productWithStoreName: ProductWithStoreName = {
      ...updatedProduct,
      storeName:
        old.data.find((p: ProductWithStoreName) => p.id === updatedProduct.id)
          ?.storeName || "",
    };

    const updatedData = old.data.map((p: ProductWithStoreName) =>
      p.id === updatedProduct.id ? productWithStoreName : p
    );

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
