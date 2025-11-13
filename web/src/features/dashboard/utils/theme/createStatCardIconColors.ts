import { Theme } from "@mui/material";

export const createStatCardIconColors = (theme: Theme) => {
  return {
    primary: {
      bg:
        theme.palette.mode === "dark"
          ? "rgba(99, 102, 241, 0.2)"
          : "rgba(99, 102, 241, 0.1)",
      color: theme.palette.primary.main,
    },
    success: {
      bg:
        theme.palette.mode === "dark"
          ? "rgba(16, 185, 129, 0.2)"
          : "rgba(16, 185, 129, 0.1)",
      color: theme.palette.success.main,
    },
    warning: {
      bg:
        theme.palette.mode === "dark"
          ? "rgba(245, 158, 11, 0.2)"
          : "rgba(245, 158, 11, 0.1)",
      color: theme.palette.warning.main,
    },
    error: {
      bg:
        theme.palette.mode === "dark"
          ? "rgba(239, 68, 68, 0.2)"
          : "rgba(239, 68, 68, 0.1)",
      color: theme.palette.error.main,
    },
  };
};
