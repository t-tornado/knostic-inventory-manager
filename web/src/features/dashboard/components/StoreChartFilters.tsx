import { FilterButton } from "./atoms";
import type { useStoreChart } from "../hooks/useStoreChart";

export const StoreChartFilters = ({
  view,
  setView,
}: ReturnType<typeof useStoreChart>) => {
  return (
    <>
      <FilterButton active={view === "count"} onClick={() => setView("count")}>
        Count
      </FilterButton>
      <FilterButton active={view === "value"} onClick={() => setView("value")}>
        Value
      </FilterButton>
    </>
  );
};
