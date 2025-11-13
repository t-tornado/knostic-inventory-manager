import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "@/app/providers";
import type { FeatureRoutes } from "@/shared/types";

const routeModules = import.meta.glob<{ [key: string]: FeatureRoutes }>(
  "./features/*/routes.{ts,tsx}",
  { eager: true }
);

const appRoutes = Object.values(routeModules).flatMap((module) => {
  return Object.values(module)[0] || [];
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider routes={appRoutes} />
  </StrictMode>
);
