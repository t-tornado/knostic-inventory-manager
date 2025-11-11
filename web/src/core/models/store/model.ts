import type { ISODateTime } from "../ValueObjects";

export type StoreId = string & { readonly brand: unique symbol };

export interface Store {
  id: StoreId;
  name: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
