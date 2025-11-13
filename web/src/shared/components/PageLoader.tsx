import { Box, CircularProgress, Typography } from "@mui/material";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader = ({ message = "Loading..." }: PageLoaderProps) => {
  return (
    <Box
      data-testid='page-loader'
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        gap: 2,
      }}
    >
      <CircularProgress size={48} data-testid='page-loader-spinner' />
      <Typography
        variant='body1'
        color='text.secondary'
        data-testid='page-loader-message'
      >
        {message}
      </Typography>
    </Box>
  );
};
