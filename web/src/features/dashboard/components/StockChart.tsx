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

export const StockChart = ({ period }: { period: "7d" | "30d" | "90d" }) => {
  const theme = useTheme();

  const data = useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Total Stock",
          data: [1200, 1180, 1220, 1190, 1240, 1230, 1247],
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
    }),
    [theme, period]
  );

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

  return <Line data={data} options={options} />;
};

// Export hook separately to avoid fast refresh warning
// eslint-disable-next-line react-refresh/only-export-components
export const useStockChart = () => {
  return useStockChartPeriod();
};
