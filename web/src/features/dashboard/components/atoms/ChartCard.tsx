import { Box } from "@mui/material";
import {
  StyledChartCard,
  StyledChartCardHeader,
  StyledChartCardIcon,
  StyledChartCardTitle,
  StyledChartCardContent,
} from "./styled";

interface ChartCardProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const ChartCard = ({
  title,
  icon,
  actions,
  children,
}: ChartCardProps) => {
  return (
    <StyledChartCard>
      <StyledChartCardHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {icon && <StyledChartCardIcon>{icon}</StyledChartCardIcon>}
          <StyledChartCardTitle variant='h6'>{title}</StyledChartCardTitle>
        </Box>
        {actions && <Box sx={{ display: "flex", gap: 1 }}>{actions}</Box>}
      </StyledChartCardHeader>
      <StyledChartCardContent>{children}</StyledChartCardContent>
    </StyledChartCard>
  );
};
