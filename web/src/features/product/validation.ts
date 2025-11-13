import { z } from "zod";

export const productPayloadSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),
  storeId: z.string().min(1, "Store is required"),
  category: z.string().min(1, "Category is required"),
  stockQuantity: z
    .number()
    .int("Stock quantity must be an integer")
    .min(0, "Stock quantity must be greater than or equal to 0"),
  price: z
    .number()
    .min(1, "Price must be greater than  0")
    .multipleOf(0.01, "Price must have at most 2 decimal places"),
});

export type ProductPayload = z.infer<typeof productPayloadSchema>;

export function validateProductPayload(data: unknown) {
  return productPayloadSchema.safeParse(data);
}
