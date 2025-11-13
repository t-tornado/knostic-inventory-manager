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

    const data = old.data as ProductWithStoreName[];
    const existingProduct = data.find((p) => p.id === updatedProduct.id);

    const productWithStoreName: ProductWithStoreName = {
      ...updatedProduct,
      storeName: existingProduct?.storeName || "",
    };

    const updatedData = data.map((p) =>
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
