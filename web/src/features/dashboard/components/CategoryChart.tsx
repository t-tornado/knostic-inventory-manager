import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartOptions } from "chart.js";
import { useTheme } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryChart = () => {
  const theme = useTheme();

  const data = useMemo(
    () => ({
      labels: [
        "Electronics",
        "Accessories",
        "Cables",
        "Software",
        "Hardware",
        "Other",
      ],
      datasets: [
        {
          data: [420, 280, 195, 150, 120, 82],
          backgroundColor: [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            "#ec4899",
            theme.palette.warning.main,
            theme.palette.success.main,
            theme.palette.text.secondary,
          ],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    }),
    [theme]
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

  return <Doughnut data={data} options={options} />;
};
