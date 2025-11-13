import { Box, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import { createStatCardIconColors } from "../../utils/theme/createStatCardIconColors";

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
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        p: 4,
        boxShadow: 1,
        transition: "all 0.3s",
        border: 1,
        borderColor: "divider",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            mb: 1,
            bgcolor: iconStyle.bg,
            color: iconStyle.color,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant='overline'
          sx={{
            color: "text.secondary",
            fontSize: 13,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant='h5'
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: "1.75rem",
          }}
        >
          {value}
        </Typography>
        {change && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: 13,
              color: change.isPositive ? "success.main" : "error.main",
            }}
          >
            {change.isPositive ? "↑" : "↓"}
            <Typography variant='caption' sx={{ fontSize: 13 }}>
              {change.value}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
