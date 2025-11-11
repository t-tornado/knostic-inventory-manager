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
    ...Array(18).fill("none"), // MUI expects 25 shadow values
  ] as any,
});
