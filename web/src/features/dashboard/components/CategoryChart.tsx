import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useCategoryChartData } from "../hooks/useCategoryChartData";
import { useCategoryChartOptions } from "../hooks/useCategoryChartOptions";
import { NoData } from "@/shared/components/NoData";
import type { CategoryData } from "../types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  categories: CategoryData[];
}

export const CategoryChart = ({ categories }: CategoryChartProps) => {
  const chartData = useCategoryChartData({ categories });
  const options = useCategoryChartOptions();

  if (categories.length === 0) {
    return <NoData title='No category data available' height={300} />;
  }

  return <Doughnut data={chartData} options={options} />;
};
