import { createTheme } from "@mui/material/styles";
import { darkPalette, lightPalette } from "./palette";

export const theme = createTheme({
  colorSchemes: {
    light: lightPalette,
    dark: darkPalette,
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
});
