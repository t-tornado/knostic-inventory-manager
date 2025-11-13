import { z } from "zod";

const PERIOD_SCHEMA = z.enum(["7d", "30d", "90d"], {
  message: 'Period must be "7d", "30d", or "90d"',
});

function parseBooleanString(value: unknown): boolean {
  if (typeof value === "string") {
    return value !== "false";
  }
  return true;
}

function parseNumberString(value: unknown): number | undefined {
  if (typeof value === "string") {
    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
}

export const DASHBOARD_QUERY_SCHEMA = z
  .object({
    stats: z
      .union([z.string(), z.boolean()])
      .transform(parseBooleanString)
      .optional(),
    categories: z
      .union([z.string(), z.boolean()])
      .transform(parseBooleanString)
      .optional(),
    stores: z
      .union([z.string(), z.boolean()])
      .transform(parseBooleanString)
      .optional(),
    stockLevels: z
      .union([z.string(), z.boolean()])
      .transform(parseBooleanString)
      .optional(),
    inventoryValue: z
      .union([z.string(), z.boolean()])
      .transform(parseBooleanString)
      .optional(),
    alerts: z
      .union([z.string(), z.boolean()])
      .transform(parseBooleanString)
      .optional(),
    activity: z
      .union([z.string(), z.boolean()])
      .transform(parseBooleanString)
      .optional(),
    stockPeriod: PERIOD_SCHEMA.optional(),
    valuePeriod: PERIOD_SCHEMA.optional(),
    alertsLimit: z
      .union([z.string(), z.number()])
      .transform(parseNumberString)
      .refine((val) => val === undefined || (val >= 1 && val <= 1000), {
        message: "alertsLimit must be between 1 and 1000",
      })
      .optional(),
    activityLimit: z
      .union([z.string(), z.number()])
      .transform(parseNumberString)
      .refine((val) => val === undefined || (val >= 1 && val <= 1000), {
        message: "activityLimit must be between 1 and 1000",
      })
      .optional(),
  })
  .passthrough();

export const ACTIVITY_QUERY_SCHEMA = z
  .object({
    limit: z
      .union([z.string(), z.number()])
      .transform(parseNumberString)
      .refine((val) => val === undefined || (val >= 1 && val <= 1000), {
        message: "limit must be between 1 and 1000",
      })
      .optional(),
  })
  .passthrough();
