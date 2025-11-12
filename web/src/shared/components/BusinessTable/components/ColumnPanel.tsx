import { useState } from "react";
import { IconButton, Badge } from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { ColumnPopover } from "./ColumnPopover";
import { useColumns } from "../hooks/useColumns";

export function ColumnPanel() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { columns, isColumnVisible } = useColumns();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const visibleCount = columns.filter((col) => isColumnVisible(col.id)).length;
  const totalCount = columns.length;
  const hasHiddenColumns = visibleCount < totalCount;

  return (
    <>
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
          badgeContent={
            hasHiddenColumns ? `${visibleCount}/${totalCount}` : "all"
          }
          color='secondary'
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
          <ViewColumnIcon fontSize='small' />
        </Badge>
      </IconButton>
      <ColumnPopover anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
}
