import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "@/app/providers";
import type { FeatureRoutes } from "@/shared/types";

/**
 * This  is a template like implementation for auto route discovery so we dont pollute the main.tsx file with routes.
 */
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
