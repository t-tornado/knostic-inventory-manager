import { IconButton, useColorScheme } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export const ThemeToggle = () => {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      sx={{
        border: 1,
        borderColor: "divider",
        "&:hover": {
          bgcolor: "action.hover",
          borderColor: "primary.main",
          transform: "scale(1.05)",
        },
        height: "32px",
        width: "32px",
      }}
      title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
    >
      {mode === "dark" ? (
        <LightModeIcon sx={{ fontSize: "16px" }} />
      ) : (
        <DarkModeIcon sx={{ fontSize: "16px" }} />
      )}
    </IconButton>
  );
};
