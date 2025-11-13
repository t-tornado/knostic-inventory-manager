import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

interface NoDataProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  height?: number | string;
}

export const NoData = ({
  title = "No data available",
  message,
  icon,
  height = 300,
}: NoDataProps) => {
  const defaultIcon = (
    <InboxIcon sx={{ fontSize: 64, color: "text.disabled" }} />
  );
  const displayIcon = icon || defaultIcon;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: typeof height === "number" ? `${height}px` : height,
        p: 3,
        textAlign: "center",
      }}
    >
      <Box sx={{ mb: 2 }}>{displayIcon}</Box>
      <Typography variant='h6' component='h2' gutterBottom color='text.primary'>
        {title}
      </Typography>
      {message && (
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ maxWidth: 400 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};
