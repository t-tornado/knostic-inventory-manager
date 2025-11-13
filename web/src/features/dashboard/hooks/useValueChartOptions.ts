import { useMemo } from "react";
import { useTheme } from "@mui/material";
import type { ChartOptions } from "chart.js";

export const useValueChartOptions = (): ChartOptions<"line"> => {
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
              return value !== null ? "$" + value.toLocaleString() : "";
            },
          },
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
            callback: function (value) {
              return "$" + (value as number) / 1000 + "k";
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
    [theme]
  );
};
