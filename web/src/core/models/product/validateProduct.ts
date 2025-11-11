import type { ValidationError } from "../../types";
import type { Product } from "./model";

export const validateProduct = (product: Product) => {
  const errors: ValidationError[] = [];
  if (!product.name) {
    errors.push({ field: "name", message: "Name is required" });
  }
  if (!product.category) {
    errors.push({ field: "category", message: "Category is required" });
  }
  if (!product.stockQuantity) {
    errors.push({
      field: "stockQuantity",
      message: "Stock quantity is required",
    });
  }
  if (!product.price) {
    errors.push({ field: "price", message: "Price is required" });
  }
  if (product.stockQuantity < 0) {
    errors.push({
      field: "stockQuantity",
      message: "Stock quantity must be greater than or equal to 0",
    });
  }
  if (product.price < 0) {
    errors.push({
      field: "price",
      message: "Price must be greater than or equal to 0",
    });
  }
  return errors;
};
