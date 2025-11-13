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
    <ListItem disablePadding sx={{ mb: 1.5 }}>
      <ListItemButton selected={isActive} onClick={onClick}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItemButton>
    </ListItem>
  );
};
