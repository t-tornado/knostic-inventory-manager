import { useState } from "react";
import { IconButton, Badge, Box, Chip } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useFilters } from "../hooks/useFilters";
import { FilterPopover } from "./FilterPopover";
import { getOperatorLabel } from "../utils/filters/operators";

export function FilterPanel() {
  const { activeFilters, removeFilter } = useFilters();
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
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          size='small'
          onClick={handleOpen}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Badge
            badgeContent={activeFilters.length}
            color='error'
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "primary.main",
                top: -8,
                right: -4,
                fontSize: 8,
                height: 16,
              },
            }}
          >
            <FilterListIcon fontSize='small' />
          </Badge>
        </IconButton>
        {activeFilters.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              ml: 1.5,
              flexWrap: "wrap",
            }}
          >
            {activeFilters.map((filter) => (
              <Chip
                key={filter.id}
                label={formatFilterLabel(filter)}
                size='small'
                onDelete={() => removeFilter(filter.id)}
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(99, 102, 241, 0.2)"
                      : "rgba(99, 102, 241, 0.1)",
                  color: "primary.main",
                  border: 1,
                  borderColor: "primary.main",
                  "& .MuiChip-deleteIcon": {
                    color: "primary.main",
                    "&:hover": {
                      color: "primary.dark",
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
      <FilterPopover anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
}
