import type { StoreId } from "./Store";
import { ISODateTime, Price } from "./ValueObject";

export type ProductId = number & { readonly brand: unique symbol };

export interface Product {
  id: ProductId;
  storeId: StoreId;
  name: string;
  category: string;
  stockQuantity: number;
  price: Price;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const createProductId = (id: number): ProductId => id as ProductId;
