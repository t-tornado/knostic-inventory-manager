export interface ValidatedDashboardQueryParams {
  stats?: boolean;
  categories?: boolean;
  stores?: boolean;
  stockLevels?: boolean;
  inventoryValue?: boolean;
  alerts?: boolean;
  activity?: boolean;
  stockPeriod?: "7d" | "30d" | "90d";
  valuePeriod?: "7d" | "30d" | "90d";
  alertsLimit?: number;
  activityLimit?: number;
}

export interface ValidatedActivityQueryParams {
  limit?: number;
}
