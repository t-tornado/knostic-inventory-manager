import { Box } from "@mui/material";
import { ChartCard } from "./atoms";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import AreaChartIcon from "@mui/icons-material/AreaChart";
import { CategoryChart } from "./CategoryChart";
import { StockChart } from "./StockChart";
import { useStockChart } from "../hooks/useStockChart";
import { StoreChart } from "./StoreChart";
import { StoreChartFilters } from "./StoreChartFilters";
import { useStoreChart } from "../hooks/useStoreChart";
import { ValueChart } from "./ValueChart";
import { useValueChart } from "../hooks/useValueChart";
import type {
  CategoryData,
  StoreData,
  StockLevelData,
  InventoryValueData,
} from "../types";
import { ChartPeriodFilters } from "./ChartPeriodFilters";

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
          actions={<ChartPeriodFilters {...stockChartState} />}
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
          actions={<ChartPeriodFilters {...valueChartState} />}
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
