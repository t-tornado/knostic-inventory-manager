import { neutral, semantic } from "./tokens";

import { brand } from "./tokens";

export const lightPalette = {
  palette: {
    mode: "light" as const,
    primary: {
      main: brand.primary[500],
      light: brand.primary[300],
      dark: brand.primary[700],
      contrastText: "#fff",
    },
    secondary: {
      main: brand.secondary[500],
      light: brand.secondary[300],
      dark: brand.secondary[700],
      contrastText: "#fff",
    },
    success: { main: semantic.success[500] },
    warning: { main: semantic.warning[500] },
    error: { main: semantic.error[500] },
    info: { main: semantic.info[500] },
    background: {
      default: neutral[50],
      paper: neutral[0],
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    divider: neutral[200],
  },
  surface: {
    1: neutral[0],
    2: neutral[100],
    3: neutral[50],
  },
};

export const darkPalette = {
  palette: {
    mode: "dark" as const,
    primary: {
      main: brand.primary[500],
      light: brand.primary[300],
      dark: brand.primary[700],
      contrastText: "#fff",
    },
    secondary: {
      main: brand.secondary[500],
      light: brand.secondary[300],
      dark: brand.secondary[700],
      contrastText: "#fff",
    },
    success: { main: semantic.success[400] },
    warning: { main: semantic.warning[400] },
    error: { main: semantic.error[400] },
    info: { main: semantic.info[400] },
    background: {
      default: neutral[900],
      paper: neutral[800],
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#cbd5e1",
    },
    divider: "rgba(255,255,255,0.12)",
  },
  surface: {
    1: neutral[800],
    2: neutral[900],
    3: neutral[1000],
  },
};
