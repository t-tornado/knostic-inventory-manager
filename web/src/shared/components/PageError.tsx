import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface PageErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * Production-grade page error component
 * Displays an error message with optional retry functionality
 */
export const PageError = ({
  title = "Something went wrong",
  message = "We encountered an error while loading this page. Please try again.",
  onRetry,
  retryLabel = "Try Again",
}: PageErrorProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        gap: 2,
        p: 3,
        textAlign: "center",
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: 64,
          color: "error.main",
          mb: 1,
        }}
      />
      <Typography variant='h5' component='h2' gutterBottom>
        {title}
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 500 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant='contained' onClick={onRetry} sx={{ mt: 2 }}>
          {retryLabel}
        </Button>
      )}
    </Box>
  );
};
