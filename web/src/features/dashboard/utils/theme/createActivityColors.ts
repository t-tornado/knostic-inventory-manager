import { Theme } from "@mui/material";

export const createActivityColors = (theme: Theme) => {
  return {
    add: {
      bg: theme.palette.success.light,
      color: theme.palette.success.main,
    },
    update: {
      bg: theme.palette.info.light,
      color: theme.palette.info.main,
    },
    delete: {
      bg: theme.palette.error.light,
      color: theme.palette.error.main,
    },
    store: {
      bg: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
  };
};
