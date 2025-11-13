import { z } from "zod";

export const CREATE_PRODUCT_SCHEMA = z.object({
  storeId: z
    .string({
      error: "storeId is required",
    })
    .min(1, "storeId cannot be empty"),
  name: z
    .string({
      error: "name is required",
    })
    .min(1, "name is required")
    .trim(),
  category: z
    .string({
      error: "category is required",
    })
    .min(1, "category is required")
    .trim(),
  stockQuantity: z
    .number({
      error: "stockQuantity is required",
    })
    .int("stockQuantity must be an integer")
    .min(0, "stockQuantity cannot be negative"),
  price: z
    .number({
      error: "Price is a number",
    })
    .nonnegative("price cannot be negative"),
});
