import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    header?: {
      background: string;
    };
  }

  interface ThemeOptions {
    header?: {
      background: string;
    };
  }
}
