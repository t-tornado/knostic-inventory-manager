import { useMemo } from "react";
import { useTheme } from "@mui/material";
import type { ChartData } from "chart.js";
import type { StockLevelData } from "../types";
import { formatChartDate } from "@/shared/utils/format";

interface UseStockChartDataProps {
  stockLevels: StockLevelData[];
}

export const useStockChartData = ({
  stockLevels,
}: UseStockChartDataProps): ChartData<"line"> => {
  const theme = useTheme();

  return useMemo(() => {
    const labels = stockLevels.map((item) => formatChartDate(item.date));

    return {
      labels,
      datasets: [
        {
          label: "Total Stock",
          data: stockLevels.map((item) => item.totalStock),
          borderColor: theme.palette.primary.main,
          backgroundColor: `${theme.palette.primary.main}1A`,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: theme.palette.background.paper,
          pointBorderWidth: 2,
        },
      ],
    };
  }, [stockLevels, theme]);
};
