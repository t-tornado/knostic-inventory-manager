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
        justifyContent: "start",
      }}
    >
      {features.enableSearching && <SearchInput />}
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        {features.enableDynamicColumns && <ColumnPanel />}
        {features.enableFiltering && <FilterPanel />}
      </Box>
    </Box>
  );
}
