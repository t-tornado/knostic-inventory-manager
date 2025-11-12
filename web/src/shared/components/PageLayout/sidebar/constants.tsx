import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import InventoryIcon from "@mui/icons-material/Inventory";
import type { NavItem } from "./types";

export const DRAWER_WIDTH = 220;

export const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/stores", label: "Stores", icon: <StoreIcon /> },
  { path: "/products", label: "Products", icon: <InventoryIcon /> },
];
