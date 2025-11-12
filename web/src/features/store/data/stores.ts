import type { Store, StoreId } from "@/core/models/store/model";
import type { ISODateTime } from "@/core/models/ValueObjects";

export const storeSeedData: Store[] = [
  {
    id: "1" as StoreId,
    name: "Main Store",
    createdAt: "2024-01-15T10:00:00Z" as ISODateTime,
    updatedAt: "2024-01-20T14:30:00Z" as ISODateTime,
  },
  {
    id: "2" as StoreId,
    name: "Downtown Branch",
    createdAt: "2024-01-16T09:00:00Z" as ISODateTime,
    updatedAt: "2024-01-21T11:20:00Z" as ISODateTime,
  },
  {
    id: "3" as StoreId,
    name: "Tech Hub",
    createdAt: "2024-01-17T08:00:00Z" as ISODateTime,
    updatedAt: "2024-01-22T16:45:00Z" as ISODateTime,
  },
  {
    id: "4" as StoreId,
    name: "West Branch",
    createdAt: "2024-01-18T10:30:00Z" as ISODateTime,
    updatedAt: "2024-01-23T09:15:00Z" as ISODateTime,
  },
  {
    id: "5" as StoreId,
    name: "East Branch",
    createdAt: "2024-01-19T11:00:00Z" as ISODateTime,
    updatedAt: "2024-01-24T13:30:00Z" as ISODateTime,
  },
  {
    id: "6" as StoreId,
    name: "North Plaza",
    createdAt: "2024-01-20T12:00:00Z" as ISODateTime,
    updatedAt: "2024-01-25T10:00:00Z" as ISODateTime,
  },
  {
    id: "7" as StoreId,
    name: "South Center",
    createdAt: "2024-01-21T13:00:00Z" as ISODateTime,
    updatedAt: "2024-01-26T15:20:00Z" as ISODateTime,
  },
  {
    id: "8" as StoreId,
    name: "Central Mall",
    createdAt: "2024-01-22T14:00:00Z" as ISODateTime,
    updatedAt: "2024-01-27T11:45:00Z" as ISODateTime,
  },
];
