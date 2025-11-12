import { Box, List } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarNavItem } from "./SidebarNavItem";
import { navItems } from "./constants";

export const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
      <List sx={{ p: 0 }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <SidebarNavItem
              key={item.path}
              item={item}
              isActive={isActive}
              onClick={() => handleNavigation(item.path)}
            />
          );
        })}
      </List>
    </Box>
  );
};
