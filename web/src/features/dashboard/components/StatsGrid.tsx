import { Box } from "@mui/material";
import { StatCard } from "./atoms";
import StoreIcon from "@mui/icons-material/Store";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";
import { formatCurrency, formatNumber } from "@/shared/utils/format";
import type { DashboardStats } from "../types";

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: 3,
        mb: 3,
      }}
    >
      <StatCard
        title='Total Stores'
        value={formatNumber(stats.totalStores)}
        icon={<StoreIcon />}
        iconColor='primary'
      />
      <StatCard
        title='Total Products'
        value={formatNumber(stats.totalProducts)}
        icon={<InventoryIcon />}
        iconColor='success'
      />
      <StatCard
        title='Total Inventory Value'
        value={formatCurrency(stats.totalInventoryValue)}
        icon={<AttachMoneyIcon />}
        iconColor='warning'
      />
      <StatCard
        title='Low Stock Alerts'
        value={formatNumber(stats.lowStockCount)}
        icon={<WarningIcon />}
        iconColor='error'
      />
    </Box>
  );
};
