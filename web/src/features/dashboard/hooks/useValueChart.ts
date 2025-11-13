import { useState } from "react";

/**
 *
 * @description Include value chart state management here and data manipulation here
 *
 */
export const useValueChart = () => {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  return { period, setPeriod };
};
