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
import { useStockChartData } from "../hooks/useStockChartData";
import { useStockChartOptions } from "../hooks/useStockChartOptions";
import { NoData } from "@/shared/components/NoData";
import type { StockLevelData } from "../types";

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

interface StockChartProps {
  period: "7d" | "30d" | "90d";
  stockLevels: StockLevelData[];
}

export const StockChart = ({ stockLevels }: StockChartProps) => {
  const chartData = useStockChartData({ stockLevels });
  const options = useStockChartOptions();

  if (stockLevels.length === 0) {
    return <NoData title='No stock level data available' height={300} />;
  }

  return <Line data={chartData} options={options} />;
};
