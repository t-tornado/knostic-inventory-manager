import type { ValidationError } from "../../types";
import type { Store } from "./model";

export const validateStore = (store: Store) => {
  const errors: ValidationError[] = [];
  if (!store.name) {
    errors.push({ field: "name", message: "Name is required" });
  }
  if (store.name.trim().length === 0) {
    errors.push({
      field: "name",
      message: "Name cannot be empty",
    });
  }
  return errors;
};
