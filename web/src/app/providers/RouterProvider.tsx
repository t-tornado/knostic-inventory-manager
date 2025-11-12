import type { FeatureRoutes } from "@/shared/types";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotFound } from "../layout/NotFound";
import { RouterWrapper } from "../layout/RouterWrapper";

interface RouterProviderProps {
  routes: FeatureRoutes;
}

export const RouterProvider = ({ routes }: RouterProviderProps) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={routes[0].path} />} />
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <RouterWrapper>
                <route.element />
              </RouterWrapper>
            }
          />
        ))}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
