import type { FeatureRoutes } from "../../shared/types";
import { AlertsProvider } from "./AlertsProvider";
import { QueryClientProvider } from "./QueryClientProvider";
import { RouterProvider } from "./RouterProvider";
import { ThemeProvider } from "./ThemeProvider";

interface AppProviderProps {
  routes: FeatureRoutes;
}
/**
 *
 * @description Root provider of the app. takes the routes and wraps the app in the necessary providers.
 *
 * This is here to create a stable definition for the app's providers
 */

export const AppProvider = ({ routes }: AppProviderProps) => {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <AlertsProvider />
        <RouterProvider routes={routes} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
