import { Card, CardContent } from "@mui/material";

interface StoreInfoCardProps {
  children: React.ReactNode;
}

export const StoreInfoCard = ({ children }: StoreInfoCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 1,
        border: 1,
        borderColor: "divider",
        flexShrink: 0,
      }}
    >
      <CardContent sx={{ p: 2 }}>{children}</CardContent>
    </Card>
  );
};
