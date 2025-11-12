import { Box, Typography, useTheme } from "@mui/material";

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

  const iconColors = {
    primary: {
      bg:
        theme.palette.mode === "dark"
          ? "rgba(99, 102, 241, 0.2)"
          : "rgba(99, 102, 241, 0.1)",
      color: theme.palette.primary.main,
    },
    success: {
      bg:
        theme.palette.mode === "dark"
          ? "rgba(16, 185, 129, 0.2)"
          : "rgba(16, 185, 129, 0.1)",
      color: theme.palette.success.main,
    },
    warning: {
      bg:
        theme.palette.mode === "dark"
          ? "rgba(245, 158, 11, 0.2)"
          : "rgba(245, 158, 11, 0.1)",
      color: theme.palette.warning.main,
    },
    error: {
      bg:
        theme.palette.mode === "dark"
          ? "rgba(239, 68, 68, 0.2)"
          : "rgba(239, 68, 68, 0.1)",
      color: theme.palette.error.main,
    },
  };

  const iconStyle = iconColors[iconColor];

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        p: 3,
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
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant='overline'
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              display: "block",
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant='h3'
            sx={{
              fontSize: 32,
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
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
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: iconStyle.bg,
            color: iconStyle.color,
            fontSize: 20,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Box>
  );
};
