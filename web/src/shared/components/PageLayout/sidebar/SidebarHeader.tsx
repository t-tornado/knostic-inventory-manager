import { Box, Typography, useTheme } from "@mui/material";

export const SidebarHeader = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        K
      </Box>
      <Typography
        variant='h6'
        sx={{
          fontSize: 20,
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        Knostic
      </Typography>
    </Box>
  );
};
