import type { ISODateTime } from "../ValueObjects";

export interface Store {
  id: string;
  name: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
