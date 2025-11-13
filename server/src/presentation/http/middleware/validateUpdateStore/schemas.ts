import { z } from "zod";

export const UPDATE_STORE_SCHEMA = z.object({
  name: z
    .string({
      error: "Store name must be a string",
    })
    .min(1, "Store name cannot be empty")
    .trim()
    .optional(),
});
