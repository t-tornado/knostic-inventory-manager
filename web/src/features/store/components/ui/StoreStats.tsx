import { Box } from "@mui/material";

interface StoreStatsProps {
  children: React.ReactNode;
}

export const StoreStats = ({ children }: StoreStatsProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: 2,
        pt: 2,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      {children}
    </Box>
  );
};
