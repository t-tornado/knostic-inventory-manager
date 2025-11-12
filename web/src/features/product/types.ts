import type { Product } from "@/core/models/product/model";

export interface ProductWithStoreName extends Product {
  storeName?: string;
}
