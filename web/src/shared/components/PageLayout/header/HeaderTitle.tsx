import { Box, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";

interface HeaderTitleProps {
  title: string;
  icon?: React.ReactNode;
}

export const HeaderTitle = ({ title, icon }: HeaderTitleProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        minWidth: 0,
        flex: "0 1 auto",
      }}
    >
      {icon || <DashboardIcon sx={{ color: "primary.main" }} />}
      <Typography
        variant='h4'
        sx={{
          fontSize: { xs: 24, sm: 28 },
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};
