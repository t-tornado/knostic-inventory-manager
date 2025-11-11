import { Box } from "@mui/material";

interface HeaderActionsProps {
  children?: React.ReactNode;
}

export const HeaderActions = ({ children }: HeaderActionsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        alignItems: "center",
        flexWrap: "wrap",
        flex: "0 1 auto",
        minWidth: 0,
      }}
    >
      {children}
    </Box>
  );
};
