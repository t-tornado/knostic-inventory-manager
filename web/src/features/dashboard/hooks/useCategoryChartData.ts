import { useMemo } from "react";
import type { ChartData } from "chart.js";
import type { CategoryData } from "../types";

const COLORS = [
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
] as const;

interface UseCategoryChartDataProps {
  categories: CategoryData[];
}

export const useCategoryChartData = ({
  categories,
}: UseCategoryChartDataProps): ChartData<"doughnut"> => {
  return useMemo(
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
};

