import { Box, Typography } from "@mui/material";

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
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        p: 3,
        boxShadow: 1,
        border: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {icon && (
            <Box
              sx={{
                color: "primary.main",
                display: "flex",
                alignItems: "center",
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            variant='h6'
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
        </Box>
        {actions && <Box sx={{ display: "flex", gap: 1 }}>{actions}</Box>}
      </Box>
      <Box sx={{ position: "relative", height: 300 }}>{children}</Box>
    </Box>
  );
};
