import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export function TableEmptyFallback() {
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
      <InboxIcon
        sx={{
          fontSize: 64,
          color: "text.disabled",
          mb: 2,
        }}
      />
      <Typography variant='h6' component='h2' gutterBottom>
        No data available
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 400 }}>
        There are no records to display at this time.
      </Typography>
    </Box>
  );
}
