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

import type { StoreData } from "../types";

interface StoreChartProps {
  view: "count" | "value";
  stores: StoreData[];
}

export const StoreChart = ({ view, stores }: StoreChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    // Sort stores by the selected view and take top 5
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

  if (stores.length === 0) {
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
        No store data available
      </div>
    );
  }

  return <Bar data={chartData} options={options} />;
};

// Export hook separately to avoid fast refresh warning
// eslint-disable-next-line react-refresh/only-export-components
export const useStoreChart = () => {
  return useStoreChartView();
};
