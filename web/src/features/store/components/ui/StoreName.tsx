import { Typography } from "@mui/material";

interface StoreNameProps {
  children: React.ReactNode;
}

export const StoreName = ({ children }: StoreNameProps) => {
  return (
    <Typography
      variant='h4'
      sx={{
        fontWeight: 700,
        mb: 1,
        color: "text.primary",
      }}
    >
      {children}
    </Typography>
  );
};
