import { Box } from "@mui/material";

interface StoreInfoHeaderProps {
  children: React.ReactNode;
}

export const StoreInfoHeader = ({ children }: StoreInfoHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 3,
      }}
    >
      {children}
    </Box>
  );
};
