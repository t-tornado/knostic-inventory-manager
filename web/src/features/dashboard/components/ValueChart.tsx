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
import { useValueChartData } from "../hooks/useValueChartData";
import { useValueChartOptions } from "../hooks/useValueChartOptions";
import { NoData } from "@/shared/components/NoData";
import type { InventoryValueData } from "../types";

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

interface ValueChartProps {
  period: "7d" | "30d" | "90d";
  inventoryValue: InventoryValueData[];
}

export const ValueChart = ({ inventoryValue }: ValueChartProps) => {
  const chartData = useValueChartData({ inventoryValue });
  const options = useValueChartOptions();

  if (inventoryValue.length === 0) {
    return <NoData title='No inventory value data available' height={300} />;
  }

  return <Line data={chartData} options={options} />;
};
