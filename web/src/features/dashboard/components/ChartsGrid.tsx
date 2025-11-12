import { Box } from "@mui/material";
import { ChartCard } from "./ui";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import AreaChartIcon from "@mui/icons-material/AreaChart";
import { CategoryChart } from "./CategoryChart";
import { StockChart, StockChartFilters, useStockChart } from "./StockChart";
import { StoreChart, StoreChartFilters, useStoreChart } from "./StoreChart";
import { ValueChart, ValueChartFilters, useValueChart } from "./ValueChart";
import type {
  CategoryData,
  StoreData,
  StockLevelData,
  InventoryValueData,
} from "../types";

interface ChartsGridProps {
  categories: CategoryData[];
  stores: StoreData[];
  stockLevels: StockLevelData[];
  inventoryValue: InventoryValueData[];
}

export const ChartsGrid = ({
  categories,
  stores,
  stockLevels,
  inventoryValue,
}: ChartsGridProps) => {
  const stockChartState = useStockChart();
  const storeChartState = useStoreChart();
  const valueChartState = useValueChart();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "repeat(2, 1fr)",
        },
        gap: 3,
        mb: 3,
      }}
    >
      <Box>
        <ChartCard title='Products by Category' icon={<PieChartIcon />}>
          <CategoryChart categories={categories} />
        </ChartCard>
      </Box>
      <Box>
        <ChartCard
          title='Stock Levels Over Time'
          icon={<ShowChartIcon />}
          actions={<StockChartFilters {...stockChartState} />}
        >
          <StockChart
            period={stockChartState.period}
            stockLevels={stockLevels}
          />
        </ChartCard>
      </Box>
      <Box>
        <ChartCard
          title='Top Stores by Product Count'
          icon={<BarChartIcon />}
          actions={<StoreChartFilters {...storeChartState} />}
        >
          <StoreChart view={storeChartState.view} stores={stores} />
        </ChartCard>
      </Box>
      <Box>
        <ChartCard
          title='Inventory Value Trend'
          icon={<AreaChartIcon />}
          actions={<ValueChartFilters {...valueChartState} />}
        >
          <ValueChart
            period={valueChartState.period}
            inventoryValue={inventoryValue}
          />
        </ChartCard>
      </Box>
    </Box>
  );
};
