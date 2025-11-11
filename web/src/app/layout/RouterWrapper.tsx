import { Suspense } from "react";
import { RouteLoader } from "./RouteLoader";
import { ErrorBoundary } from "./ErrorBoundary";

export const RouterWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Suspense>
  );
};
