import { useState } from "react";
import { Box, Button, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useFilters } from "../hooks/useFilters";
import { FilterPopover } from "./FilterPopover";
import { getOperatorLabel } from "../utils/filters/operators";

export function FilterPanel() {
  const { activeFilters, clearFilters, removeFilter } = useFilters();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatFilterLabel = (filter: (typeof activeFilters)[0]) => {
    if (filter.operator === "is_null" || filter.operator === "is_not_null") {
      return `${filter.field} ${getOperatorLabel(filter.operator)}`;
    }
    return `${filter.field} ${getOperatorLabel(filter.operator)} ${
      filter.value
    }`;
  };

  return (
    <>
      <Box
        sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}
      >
        <Button
          size='small'
          startIcon={<AddIcon />}
          variant='outlined'
          onClick={handleOpen}
        >
          Add Filter
        </Button>
        {activeFilters.length > 0 && (
          <>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.id}
                label={formatFilterLabel(filter)}
                size='small'
                onDelete={() => removeFilter(filter.id)}
              />
            ))}
            <Button size='small' onClick={clearFilters}>
              Clear All
            </Button>
          </>
        )}
      </Box>
      <FilterPopover anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
}
