import type { ProductWithStoreName } from "@/core/models/product/model";
import { ProductMetaModalFormState } from "./types";

export const createInitialState = (
  product: ProductWithStoreName | null,
  storeOptions: Array<{ id: string; name: string }>
): ProductMetaModalFormState => {
  if (!product) {
    return {
      name: "",
      storeId: storeOptions[0]?.id ? String(storeOptions[0].id) : "",
      storeName: storeOptions[0]?.name ?? "",
      category: "",
      stockQuantity: "",
      price: "",
    };
  }

  const foundStore =
    storeOptions.find((option) => option.id === String(product.storeId)) ||
    storeOptions.find((option) => option.name === product.storeName);

  return {
    name: product.name,
    storeId: foundStore?.id ?? String(product.storeId),
    storeName: foundStore?.name ?? product.storeName ?? "",
    category: product.category ?? "",
    stockQuantity: String(product.stockQuantity ?? ""),
    price: String(product.price ?? ""),
  };
};
