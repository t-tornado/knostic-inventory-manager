import { Box } from "@mui/material";

interface StoreInfoActionsProps {
  children: React.ReactNode;
}

export const StoreInfoActions = ({ children }: StoreInfoActionsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
      }}
    >
      {children}
    </Box>
  );
};
