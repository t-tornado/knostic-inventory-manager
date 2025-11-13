import { FilterButton } from "./atoms";
import { useStockChart } from "../hooks/useStockChart";

export const ChartPeriodFilters = ({
  period,
  setPeriod,
}: ReturnType<typeof useStockChart>) => {
  return (
    <>
      <FilterButton
        disabled
        active={period === "7d"}
        onClick={() => setPeriod("7d")}
      >
        7D
      </FilterButton>
      <FilterButton
        disabled
        active={period === "30d"}
        onClick={() => setPeriod("30d")}
      >
        30D
      </FilterButton>
      <FilterButton
        disabled
        active={period === "90d"}
        onClick={() => setPeriod("90d")}
      >
        90D
      </FilterButton>
    </>
  );
};
