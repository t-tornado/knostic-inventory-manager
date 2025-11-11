import type { FeatureRoutes } from "../../shared/types";
import { QueryClientProvider } from "./QueryClientProvider";
import { RouterProvider } from "./RouterProvider";
import { ThemeProvider } from "./ThemeProvider";

interface AppProviderProps {
  routes: FeatureRoutes;
}

export const AppProvider = ({ routes }: AppProviderProps) => {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <RouterProvider routes={routes} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
