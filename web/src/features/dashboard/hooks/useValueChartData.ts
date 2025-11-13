import { useMemo } from "react";
import { useTheme } from "@mui/material";
import type { ChartData } from "chart.js";
import type { InventoryValueData } from "../types";
import { formatChartDate } from "@/shared/utils/format";

interface UseValueChartDataProps {
  inventoryValue: InventoryValueData[];
}

export const useValueChartData = ({
  inventoryValue,
}: UseValueChartDataProps): ChartData<"line"> => {
  const theme = useTheme();

  return useMemo(() => {
    const labels = inventoryValue.map((item) => formatChartDate(item.date));

    return {
      labels,
      datasets: [
        {
          label: "Inventory Value",
          data: inventoryValue.map((item) => item.totalValue),
          borderColor: theme.palette.success.main,
          backgroundColor: `${theme.palette.success.main}33`,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: theme.palette.success.main,
          pointBorderColor: theme.palette.background.paper,
          pointBorderWidth: 2,
        },
      ],
    };
  }, [inventoryValue, theme]);
};
