import { ISODateTime } from "./ValueObject";

export type StoreId = string & { readonly brand: unique symbol };

export interface Store {
  id: StoreId;
  name: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const createStoreId = (id: string): StoreId => id as StoreId;
