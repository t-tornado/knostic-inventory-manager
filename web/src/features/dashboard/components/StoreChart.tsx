import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { useTheme } from "@mui/material";
import { FilterButton } from "./ui";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const useStoreChartView = () => {
  const [view, setView] = useState<"count" | "value">("count");
  return { view, setView };
};

export const StoreChartFilters = ({
  view,
  setView,
}: ReturnType<typeof useStoreChartView>) => {
  return (
    <>
      <FilterButton active={view === "count"} onClick={() => setView("count")}>
        Count
      </FilterButton>
      <FilterButton active={view === "value"} onClick={() => setView("value")}>
        Value
      </FilterButton>
    </>
  );
};

export const StoreChart = ({ view }: { view: "count" | "value" }) => {
  const theme = useTheme();

  const data = useMemo(
    () => ({
      labels: [
        "Main Store",
        "Downtown",
        "Tech Hub",
        "West Branch",
        "East Branch",
      ],
      datasets: [
        {
          label: view === "count" ? "Product Count" : "Inventory Value",
          data:
            view === "count"
              ? [320, 280, 245, 195, 150]
              : [85000, 72000, 65000, 52000, 40000],
          backgroundColor: theme.palette.primary.main,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    }),
    [theme, view]
  );

  const options: ChartOptions<"bar"> = useMemo(
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
          callbacks: {
            label: function (context) {
              const value = context.parsed.y;
              if (value === null) return "";
              if (view === "value") {
                return "$" + value.toLocaleString();
              }
              return value.toString();
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: theme.palette.divider,
          },
          ticks: {
            font: {
              size: 12,
            },
            color: theme.palette.text.secondary,
            callback: function (value) {
              if (view === "value") {
                return "$" + (value as number) / 1000 + "k";
              }
              return value;
            },
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
    [theme, view]
  );

  return <Bar data={data} options={options} />;
};

// Export hook separately to avoid fast refresh warning
// eslint-disable-next-line react-refresh/only-export-components
export const useStoreChart = () => {
  return useStoreChartView();
};
