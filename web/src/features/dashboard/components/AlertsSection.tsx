import { Box, Typography } from "@mui/material";
import { SectionHeader, AlertItem } from "./atoms";
import NotificationsIcon from "@mui/icons-material/Notifications";
import type { LowStockAlert } from "../types";
import { StyledSectionCard } from "./atoms/styled";

interface AlertsSectionProps {
  alerts: LowStockAlert[];
}

export const AlertsSection = ({ alerts }: AlertsSectionProps) => {
  if (alerts.length === 0) {
    return (
      <StyledSectionCard data-testid='alerts-section'>
        <SectionHeader title='Low Stock Alerts' icon={<NotificationsIcon />} />
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ p: 2, textAlign: "center" }}
          data-testid='alerts-empty'
        >
          No low stock alerts at this time.
        </Typography>
      </StyledSectionCard>
    );
  }

  return (
    <StyledSectionCard data-testid='alerts-section'>
      <SectionHeader title='Low Stock Alerts' icon={<NotificationsIcon />} />
      <Box
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
          mt: 2,
        }}
        data-testid='alerts-list'
      >
        {alerts.map((alert) => (
          <AlertItem key={`${alert.productId}-${alert.storeId}`} data={alert} />
        ))}
      </Box>
    </StyledSectionCard>
  );
};
