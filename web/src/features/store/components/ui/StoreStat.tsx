import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface StoreStatProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconColor?: "primary" | "success" | "warning" | "info";
}

const iconColorMap: Record<
  "primary" | "success" | "warning" | "info",
  SxProps<Theme>
> = {
  primary: {
    bgcolor: (theme) => `${theme.palette.primary.main}1A`,
    color: "primary.main",
  },
  success: {
    bgcolor: (theme) => `${theme.palette.success.main}1A`,
    color: "success.main",
  },
  warning: {
    bgcolor: (theme) => `${theme.palette.warning.main}1A`,
    color: "warning.main",
  },
  info: {
    bgcolor: (theme) => `${theme.palette.info.main}1A`,
    color: "info.main",
  },
};

export const StoreStat = ({
  icon,
  label,
  value,
  iconColor = "primary",
}: StoreStatProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          mb: 1,
          ...iconColorMap[iconColor],
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
        }}
      >
        {label}
      </Typography>
      <Typography
        variant='h5'
        sx={{
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};
