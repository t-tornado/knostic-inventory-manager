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
import { useStoreChartData } from "../hooks/useStoreChartData";
import { useStoreChartOptions } from "../hooks/useStoreChartOptions";
import { NoData } from "@/shared/components/NoData";
import type { StoreData } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StoreChartProps {
  view: "count" | "value";
  stores: StoreData[];
}

export const StoreChart = ({ view, stores }: StoreChartProps) => {
  const chartData = useStoreChartData({ stores, view });
  const options = useStoreChartOptions({ view });

  if (stores.length === 0) {
    return <NoData title='No store data available' height={300} />;
  }

  return <Bar data={chartData} options={options} />;
};
