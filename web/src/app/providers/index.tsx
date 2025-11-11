import type { FeatureRoutes } from "../../lib/types";
import { QueryClientProvider } from "./QueryClientProvider";
import { RouterProvider } from "./RouterProvider";

interface AppProviderProps {
  routes: FeatureRoutes;
}

export const AppProvider = ({ routes }: AppProviderProps) => {
  return (
    <QueryClientProvider>
      <RouterProvider routes={routes} />
    </QueryClientProvider>
  );
};
