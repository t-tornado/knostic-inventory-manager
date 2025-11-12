import { Typography } from "@mui/material";

interface StoreIdProps {
  children: React.ReactNode;
}

export const StoreId = ({ children }: StoreIdProps) => {
  return (
    <Typography
      variant='body2'
      sx={{
        color: "text.secondary",
        fontFamily: "monospace",
        fontSize: 14,
      }}
    >
      ID: {children}
    </Typography>
  );
};
