import { Box } from "@mui/material";

interface StoreInfoDetailsProps {
  children: React.ReactNode;
}

export const StoreInfoDetails = ({ children }: StoreInfoDetailsProps) => {
  return <Box sx={{ flex: 1 }}>{children}</Box>;
};
