import { Box, Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

interface StoreIdProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isLink?: boolean;
}

export const StoreId = ({ children, isLink, ...props }: StoreIdProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: isLink ? "pointer" : "default",
      }}
      {...props}
    >
      {isLink && <LinkIcon />}
      <Typography
        variant='body2'
        sx={{
          color: "text.secondary",
          fontFamily: "monospace",
          fontSize: 14,
          cursor: isLink ? "pointer" : "default",
        }}
      >
        ID: {children}
      </Typography>
    </Box>
  );
};
