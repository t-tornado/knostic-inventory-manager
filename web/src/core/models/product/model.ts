import type { StoreId } from "../store/model";
import type { ISODateTime, Price } from "../ValueObjects";

export type ProductId = string & { readonly brand: unique symbol };

export interface Product {
  id: ProductId;
  storeId: StoreId;
  name: string;
  category: string;
  stockQuantity: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  price: Price;
}
