import { Box } from "@mui/material";
import { useTableState } from "../hooks";
import { SearchInput, FilterPanel, ColumnPanel } from "./index";

export function TableControls() {
  const { config } = useTableState();
  const { features } = config;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {features.enableSearching && <SearchInput />}
      {features.enableFiltering && <FilterPanel />}
      {features.enableDynamicColumns && <ColumnPanel />}
    </Box>
  );
}
