import { Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { HeaderTitle } from "./HeaderTitle";
import { HeaderActions } from "./HeaderActions";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Header = ({ title, icon, actions }: HeaderProps) => {
  return (
    <Box
      sx={{
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        mb: 3,
        width: "100%",
        boxSizing: "border-box",
        boxShadow: (theme) =>
          theme.palette.mode === "dark" ? theme.shadows[6] : theme.shadows[5],
        display: "flex",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        bgcolor: "background.paper",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 0 },
        alignItems: { xs: "flex-start", sm: "center" },
        height: "60px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minWidth: 0,
          flex: "0 1 auto",
        }}
      >
        {icon || <DashboardIcon sx={{ color: "primary.main" }} />}
        <HeaderTitle title={title} />
      </Box>
      <HeaderActions>
        <ThemeToggle />
        {actions}
      </HeaderActions>
    </Box>
  );
};
