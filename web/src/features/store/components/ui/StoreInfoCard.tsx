import { Card, CardContent } from "@mui/material";

interface StoreInfoCardProps {
  children: React.ReactNode;
}

export const StoreInfoCard = ({ children }: StoreInfoCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        mb: 3,
        boxShadow: 1,
        border: 1,
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 4 }}>{children}</CardContent>
    </Card>
  );
};
