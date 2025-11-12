import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { useTheme } from "@mui/material";
import { FilterButton } from "./ui";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const useStockChartPeriod = () => {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  return { period, setPeriod };
};

export const StockChartFilters = ({
  period,
  setPeriod,
}: ReturnType<typeof useStockChartPeriod>) => {
  return (
    <>
      <FilterButton active={period === "7d"} onClick={() => setPeriod("7d")}>
        7D
      </FilterButton>
      <FilterButton active={period === "30d"} onClick={() => setPeriod("30d")}>
        30D
      </FilterButton>
      <FilterButton active={period === "90d"} onClick={() => setPeriod("90d")}>
        90D
      </FilterButton>
    </>
  );
};

import type { StockLevelData } from "../types";

interface StockChartProps {
  period: "7d" | "30d" | "90d";
  stockLevels: StockLevelData[];
}

export const StockChart = ({ stockLevels }: StockChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    // Format dates for labels
    const labels = stockLevels.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });

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

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(30, 41, 59, 0.95)"
              : "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          titleColor: theme.palette.mode === "dark" ? "#f1f5f9" : "#ffffff",
          bodyColor: theme.palette.mode === "dark" ? "#cbd5e1" : "#ffffff",
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: theme.palette.divider,
          },
          ticks: {
            font: {
              size: 12,
            },
            color: theme.palette.text.secondary,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
            },
            color: theme.palette.text.secondary,
          },
        },
      },
    }),
    [theme]
  );

  if (stockLevels.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
          color: theme.palette.text.secondary,
        }}
      >
        No stock level data available
      </div>
    );
  }

  return <Line data={chartData} options={options} />;
};

// Export hook separately to avoid fast refresh warning
// eslint-disable-next-line react-refresh/only-export-components
export const useStockChart = () => {
  return useStockChartPeriod();
};
