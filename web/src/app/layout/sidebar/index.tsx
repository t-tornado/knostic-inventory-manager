import { Box, Drawer } from "@mui/material";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { DRAWER_WIDTH } from "./constants";

export const Sidebar = () => {
  return (
    <Drawer
      variant='permanent'
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: 1,
          borderColor: "divider",
          boxShadow: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: "background.paper",
        }}
      >
        <SidebarHeader />
        <SidebarNav />
        <SidebarUserProfile />
      </Box>
    </Drawer>
  );
};
