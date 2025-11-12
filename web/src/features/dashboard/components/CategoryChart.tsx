import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartOptions } from "chart.js";
import { useTheme } from "@mui/material";
import type { CategoryData } from "../types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  categories: CategoryData[];
}

const COLORS = [
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
] as const;

export const CategoryChart = ({ categories }: CategoryChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(
    () => ({
      labels: categories.map((cat) => cat.category),
      datasets: [
        {
          data: categories.map((cat) => cat.count),
          backgroundColor: categories.map((_, index) => {
            const colorIndex = index % COLORS.length;
            return COLORS[colorIndex];
          }),
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    }),
    [categories]
  );

  const options: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            padding: 15,
            usePointStyle: true,
            font: {
              size: 13,
            },
            color: theme.palette.text.secondary,
          },
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
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    }),
    [theme]
  );

  if (categories.length === 0) {
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
        No category data available
      </div>
    );
  }

  return <Doughnut data={chartData} options={options} />;
};
