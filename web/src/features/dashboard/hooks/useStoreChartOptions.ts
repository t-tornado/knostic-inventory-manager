import { useMemo } from "react";
import { useTheme } from "@mui/material";
import type { ChartOptions } from "chart.js";

interface UseStoreChartOptionsProps {
  view: "count" | "value";
}

export const useStoreChartOptions = ({
  view,
}: UseStoreChartOptionsProps): ChartOptions<"bar"> => {
  const theme = useTheme();

  return useMemo(
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
};
