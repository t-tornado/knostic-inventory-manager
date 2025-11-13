import { useTheme } from "@mui/material";
import { useMemo } from "react";
import { createStatCardIconColors } from "../../utils/theme/createStatCardIconColors";
import {
  StyledStatCard,
  StyledStatCardContent,
  StyledStatCardIcon,
  StyledStatCardTitle,
  StyledStatCardValue,
  StyledStatCardChange,
  StyledStatCardChangeText,
} from "./styled";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconColor?: "primary" | "success" | "warning" | "error";
}

export const StatCard = ({
  title,
  value,
  change,
  icon,
  iconColor = "primary",
}: StatCardProps) => {
  const theme = useTheme();

  const iconColors = useMemo(() => createStatCardIconColors(theme), [theme]);

  const iconStyle = iconColors[iconColor];

  return (
    <StyledStatCard>
      <StyledStatCardContent>
        <StyledStatCardIcon bgcolor={iconStyle.bg} iconColor={iconStyle.color}>
          {icon}
        </StyledStatCardIcon>
        <StyledStatCardTitle variant='overline'>{title}</StyledStatCardTitle>
        <StyledStatCardValue variant='h5'>{value}</StyledStatCardValue>
        {change && (
          <StyledStatCardChange isPositive={change.isPositive}>
            {change.isPositive ? "↑" : "↓"}
            <StyledStatCardChangeText variant='caption'>
              {change.value}
            </StyledStatCardChangeText>
          </StyledStatCardChange>
        )}
      </StyledStatCardContent>
    </StyledStatCard>
  );
};
