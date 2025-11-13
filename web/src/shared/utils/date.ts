import { ISODateTime } from "@/core/models/ValueObjects";

export const nowISO = () => {
  return new Date().toISOString() as ISODateTime;
};
