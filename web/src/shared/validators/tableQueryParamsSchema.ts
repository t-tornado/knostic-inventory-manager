import { z } from "zod";
import { PAGE_CONFIG } from "../config/pageConfig";

export const TableQueryParamsSchema = z.object({
  search: z
    .string()
    .min(1, "Search parameter cannot be empty")
    .optional()
    .or(z.undefined()),
  filters: z
    .string()
    .refine(
      (str) => {
        try {
          const parsed = JSON.parse(str);
          return Array.isArray(parsed);
        } catch {
          return false;
        }
      },
      {
        message: "Filters must be valid JSON array",
      }
    )
    .optional()
    .or(z.undefined()),
  page: z
    .number()
    .int()
    .min(
      PAGE_CONFIG.MIN_PAGE,
      `Page must be greater than or equal to ${PAGE_CONFIG.MIN_PAGE}`
    )
    .optional()
    .or(z.undefined()),
  pageSize: z
    .number()
    .int()
    .min(
      PAGE_CONFIG.MIN_PAGE_SIZE,
      `Page size must be at least ${PAGE_CONFIG.MIN_PAGE_SIZE}`
    )
    .max(
      PAGE_CONFIG.MAX_PAGE_SIZE,
      `Page size must be at most ${PAGE_CONFIG.MAX_PAGE_SIZE}`
    )
    .optional()
    .or(z.undefined()),
});
