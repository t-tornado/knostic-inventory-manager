import { Box, CircularProgress, Typography } from "@mui/material";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader = ({ message = "Loading..." }: PageLoaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
      <Typography variant='body1' color='text.secondary'>
        {message}
      </Typography>
    </Box>
  );
};
