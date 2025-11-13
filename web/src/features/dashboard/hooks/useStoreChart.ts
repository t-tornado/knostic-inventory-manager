import { useState } from "react";

export const useStoreChart = () => {
  const [view, setView] = useState<"count" | "value">("count");
  return { view, setView };
};
