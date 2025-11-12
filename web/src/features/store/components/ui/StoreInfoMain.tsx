import { Box } from "@mui/material";

interface StoreInfoMainProps {
  children: React.ReactNode;
}

export const StoreInfoMain = ({ children }: StoreInfoMainProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      {children}
    </Box>
  );
};
