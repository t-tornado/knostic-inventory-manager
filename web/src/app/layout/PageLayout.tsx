import { Box, useTheme } from "@mui/material";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  headerIcon?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export const PageLayout = ({
  children,
  title = "Dashboard",
  headerIcon,
  headerActions,
}: PageLayoutProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: `100%`,
          ml: 0,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box
          sx={{
            maxWidth: 1600,
            mx: "auto",
            p: 3,
          }}
        >
          <Header title={title} icon={headerIcon} actions={headerActions} />
          <Box>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};
