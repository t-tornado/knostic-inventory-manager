import { z } from "zod";

export const storePayloadSchema = z.object({
  name: z.string().min(1, "Store name is required").trim(),
});

export type StorePayload = z.infer<typeof storePayloadSchema>;

export function validateStorePayload(data: unknown) {
  return storePayloadSchema.safeParse(data);
}
