import { Grid } from "@mui/material";
import { StatCard } from "./ui";
import StoreIcon from "@mui/icons-material/Store";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";

export const StatsGrid = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Total Stores'
          value='24'
          change={{ value: "12% from last month", isPositive: true }}
          icon={<StoreIcon />}
          iconColor='primary'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Total Products'
          value='1,247'
          change={{ value: "8% from last month", isPositive: true }}
          icon={<InventoryIcon />}
          iconColor='success'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Total Inventory Value'
          value='$284,592'
          change={{ value: "15% from last month", isPositive: true }}
          icon={<AttachMoneyIcon />}
          iconColor='warning'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Low Stock Alerts'
          value='18'
          change={{ value: "3 resolved today", isPositive: false }}
          icon={<WarningIcon />}
          iconColor='error'
        />
      </Grid>
    </Grid>
  );
};
