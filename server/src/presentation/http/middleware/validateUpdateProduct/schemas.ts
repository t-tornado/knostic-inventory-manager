import { z } from "zod";

export const UPDATE_PRODUCT_SCHEMA = z.object({
  storeId: z
    .string({
      error: "storeId must be a string",
    })
    .min(1, "storeId cannot be empty")
    .optional(),
  name: z
    .string({
      error: "name must be a string",
    })
    .min(1, "name cannot be empty")
    .trim()
    .optional(),
  category: z
    .string({
      error: "category must be a string",
    })
    .min(1, "category cannot be empty")
    .trim()
    .optional(),
  stockQuantity: z
    .number({
      error: "stockQuantity must be a number",
    })
    .int("stockQuantity must be an integer")
    .min(0, "stockQuantity cannot be negative")
    .optional(),
  price: z
    .number({
      error: "price must be a number",
    })
    .nonnegative("price cannot be negative")
    .optional(),
});
