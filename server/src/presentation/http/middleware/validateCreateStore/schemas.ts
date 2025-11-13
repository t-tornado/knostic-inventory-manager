import { z } from "zod";

export const CREATE_STORE_SCHEMA = z.object({
  name: z
    .string({
      message: "Store name must be a string",
    })
    .min(1, "Store name cannot be empty")
    .trim(),
});
