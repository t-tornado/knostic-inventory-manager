import { ISODateTime } from "./ValueObject";

export type StoreId = number & { readonly brand: unique symbol };

export interface Store {
  id: StoreId;
  name: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const createStoreId = (id: number): StoreId => id as StoreId;
