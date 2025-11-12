import { Typography } from "@mui/material";

interface StoreNameProps {
  children: React.ReactNode;
}

export const StoreName = ({ children }: StoreNameProps) => {
  return (
    <Typography
      variant='h5'
      sx={{
        fontWeight: 700,
        mb: 0.5,
        color: "text.primary",
        fontSize: "1.25rem",
      }}
    >
      {children}
    </Typography>
  );
};
