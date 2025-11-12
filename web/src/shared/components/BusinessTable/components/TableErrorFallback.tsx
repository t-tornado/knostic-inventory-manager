import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface TableErrorFallbackProps {
  error: Error;
  refetch?: () => void;
}

export function TableErrorFallback({
  error,
  refetch,
}: TableErrorFallbackProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        p: 3,
        textAlign: "center",
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: 64,
          color: "error.main",
          mb: 2,
        }}
      />
      <Typography variant='h6' component='h2' gutterBottom>
        Failed to load data
      </Typography>
      <Typography
        variant='body2'
        color='text.secondary'
        sx={{ maxWidth: 400, mb: 3 }}
      >
        {error.message || "An error occurred while loading the data."}
      </Typography>
      {refetch && (
        <Button variant='contained' onClick={() => refetch()}>
          Reload
        </Button>
      )}
    </Box>
  );
}
