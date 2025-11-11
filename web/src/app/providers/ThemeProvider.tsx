import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme } from "@/shared/theme";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
