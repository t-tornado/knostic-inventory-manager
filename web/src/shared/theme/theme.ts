import { createTheme } from "@mui/material/styles";
import { darkPalette, headerShadow, lightPalette } from "./palette";
import { shadows } from "./tokens";

export const theme = createTheme({
  colorSchemes: {
    light: lightPalette,
    dark: darkPalette,
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  shadows: [
    "none",
    shadows.sm,
    shadows.md,
    shadows.lg,
    shadows.xl,
    headerShadow.light,
    headerShadow.dark,
    ...Array(18).fill("none"),
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          disableRipple: true,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          disableRipple: true,
          borderRadius: 1,
          py: 1.5,
          px: 2,
          height: "40px",
          backgroundColor: "transparent",
          color: "text.secondary",
          "&:hover": {
            backgroundColor: "action.hover",
            color: "text.primary",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              color: "primary.main",
            },
            "& .MuiListItemIcon-root": {
              color: "primary.main",
            },
          },
          "& .MuiListItemIcon-root": {
            color: "text.disabled",
            minWidth: 40,
          },
        },
      },
    },
  },
});
