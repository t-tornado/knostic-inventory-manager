import { Box } from "@mui/material";
import StoreIconMUI from "@mui/icons-material/Store";

interface StoreIconProps {
  size?: number;
}

export const StoreIcon = ({ size = 80 }: StoreIconProps) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 3,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        boxShadow: 2,
      }}
    >
      <StoreIconMUI sx={{ fontSize: size * 0.45 }} />
    </Box>
  );
};
