import { useMemo } from "react";
import { useTheme } from "@mui/material";
import type { ChartData } from "chart.js";
import type { StoreData } from "../types";

interface UseStoreChartDataProps {
  stores: StoreData[];
  view: "count" | "value";
}

export const useStoreChartData = ({
  stores,
  view,
}: UseStoreChartDataProps): ChartData<"bar"> => {
  const theme = useTheme();

  return useMemo(() => {
    const sortedStores = [...stores].sort((a, b) => {
      if (view === "count") {
        return b.productCount - a.productCount;
      }
      return b.inventoryValue - a.inventoryValue;
    });

    const topStores = sortedStores.slice(0, 5);

    return {
      labels: topStores.map((store) => store.storeName),
      datasets: [
        {
          label: view === "count" ? "Product Count" : "Inventory Value",
          data: topStores.map((store) =>
            view === "count" ? store.productCount : store.inventoryValue
          ),
          backgroundColor: theme.palette.primary.main,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  }, [stores, view, theme]);
};
