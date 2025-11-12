import { Grid } from "@mui/material";
import { StatCard } from "./ui";
import StoreIcon from "@mui/icons-material/Store";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";
import type { DashboardStats } from "../types";

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid>
        <StatCard
          title='Total Stores'
          value={formatNumber(stats.totalStores)}
          icon={<StoreIcon />}
          iconColor='primary'
        />
      </Grid>
      <Grid>
        <StatCard
          title='Total Products'
          value={formatNumber(stats.totalProducts)}
          icon={<InventoryIcon />}
          iconColor='success'
        />
      </Grid>
      <Grid>
        <StatCard
          title='Total Inventory Value'
          value={formatCurrency(stats.totalInventoryValue)}
          icon={<AttachMoneyIcon />}
          iconColor='warning'
        />
      </Grid>
      <Grid>
        <StatCard
          title='Low Stock Alerts'
          value={formatNumber(stats.lowStockCount)}
          icon={<WarningIcon />}
          iconColor='error'
        />
      </Grid>
    </Grid>
  );
};
