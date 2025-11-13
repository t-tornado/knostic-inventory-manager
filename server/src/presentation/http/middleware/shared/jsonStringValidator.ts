import { z } from "zod";

export function createJsonStringValidator<T>(
  schema: z.ZodSchema<T>,
  errorMessage: string
): z.ZodOptional<z.ZodString> {
  return z
    .string()
    .refine(
      (str) => {
        try {
          const parsed = JSON.parse(str);
          return schema.safeParse(parsed).success;
        } catch {
          return false;
        }
      },
      {
        message: errorMessage,
      }
    )
    .optional();
}

