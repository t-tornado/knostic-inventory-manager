import { Box, CircularProgress } from "@mui/material";

export const RouteLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <CircularProgress size={48} />
    </Box>
  );
};
