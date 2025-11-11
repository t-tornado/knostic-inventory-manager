import { Box, Typography, Avatar, useTheme } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const SidebarUserProfile = () => {
  const theme = useTheme();

  return (
    <Box sx={{ borderTop: 1, borderColor: "divider" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          cursor: "pointer",
          borderRadius: 1,
          m: 1,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          JD
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant='body2'
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: 14,
            }}
          >
            John Doe
          </Typography>
          <Typography
            variant='caption'
            sx={{
              color: "text.secondary",
              fontSize: 12,
            }}
          >
            Administrator
          </Typography>
        </Box>
        <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "text.disabled" }} />
      </Box>
    </Box>
  );
};
