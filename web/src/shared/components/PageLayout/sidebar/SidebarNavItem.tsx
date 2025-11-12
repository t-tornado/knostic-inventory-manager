import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import type { NavItem } from "./types";

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

export const SidebarNavItem = ({
  item,
  isActive,
  onClick,
}: SidebarNavItemProps) => {
  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={onClick}
        sx={{
          borderRadius: 1,
          py: 1.5,
          px: 2,
          bgcolor: isActive ? "rgba(99, 102, 241, 0.1)" : "transparent",
          color: isActive ? "primary.main" : "text.secondary",
          "&:hover": {
            bgcolor: isActive ? "rgba(99, 102, 241, 0.15)" : "action.hover",
            color: isActive ? "primary.main" : "text.primary",
          },
          "& .MuiListItemIcon-root": {
            color: isActive ? "primary.main" : "text.disabled",
            minWidth: 40,
          },
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItemButton>
    </ListItem>
  );
};
