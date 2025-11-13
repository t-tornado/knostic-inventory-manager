import type { ISODateTime } from "../ValueObjects";

export type ProductId = string;
export interface Product {
  id: ProductId;
  storeId: string;
  name: string;
  category: string;
  stockQuantity: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  price: number;
}

export interface ProductWithStoreName extends Product {
  storeName?: string;
}
