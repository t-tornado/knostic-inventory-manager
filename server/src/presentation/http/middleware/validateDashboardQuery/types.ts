export interface ValidatedDashboardQueryParams {
  stats?: boolean | undefined;
  categories?: boolean | undefined;
  stores?: boolean | undefined;
  stockLevels?: boolean | undefined;
  inventoryValue?: boolean | undefined;
  alerts?: boolean | undefined;
  activity?: boolean | undefined;
  stockPeriod?: "7d" | "30d" | "90d" | undefined;
  valuePeriod?: "7d" | "30d" | "90d" | undefined;
  alertsLimit?: number | undefined;
  activityLimit?: number | undefined;
}

export interface ValidatedActivityQueryParams {
  limit?: number | undefined;
}
