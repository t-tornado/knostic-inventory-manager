import { Box } from "@mui/material";

interface SectionCardProps {
  children: React.ReactNode;
}

export const SectionCard = ({ children }: SectionCardProps) => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        p: 3,
        boxShadow: 1,
        border: 1,
        borderColor: "divider",
        mb: 3,
      }}
    >
      {children}
    </Box>
  );
};
