import { Box, Typography } from "@mui/material";
import { SectionCard, SectionHeader, AlertItem } from "./ui";
import NotificationsIcon from "@mui/icons-material/Notifications";
import type { LowStockAlert } from "../types";

interface AlertsSectionProps {
  alerts: LowStockAlert[];
}

export const AlertsSection = ({ alerts }: AlertsSectionProps) => {
  if (alerts.length === 0) {
    return (
      <SectionCard>
        <SectionHeader title='Low Stock Alerts' icon={<NotificationsIcon />} />
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ p: 2, textAlign: "center" }}
        >
          No low stock alerts at this time.
        </Typography>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <SectionHeader title='Low Stock Alerts' icon={<NotificationsIcon />} />
      <Box
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
          mt: 2,
        }}
      >
        {alerts.map((alert) => (
          <AlertItem
            key={`${alert.productId}-${alert.storeId}`}
            title={`${alert.productName} - Only ${alert.stockQuantity} unit${
              alert.stockQuantity !== 1 ? "s" : ""
            } remaining`}
            description={`Store: ${alert.storeName} • Category: ${alert.category} • Current Stock: ${alert.stockQuantity}`}
          />
        ))}
      </Box>
    </SectionCard>
  );
};
