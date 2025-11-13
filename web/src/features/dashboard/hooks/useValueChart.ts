import { useState } from "react";

export const useValueChart = () => {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  return { period, setPeriod };
};
