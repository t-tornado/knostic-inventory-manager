import { Box, Typography } from "@mui/material";

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export const SectionHeader = ({ title, icon, actions }: SectionHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon && (
          <Box
            sx={{ color: "error.main", display: "flex", alignItems: "center" }}
          >
            {icon}
          </Box>
        )}
        <Typography
          variant='h6'
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
      </Box>
      {actions && <Box>{actions}</Box>}
    </Box>
  );
};
