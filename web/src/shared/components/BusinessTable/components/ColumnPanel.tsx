import { useState } from "react";
import { Button } from "@mui/material";
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
  const hasHiddenColumns = visibleCount < columns.length;

  return (
    <>
      <Button
        size='small'
        startIcon={<ViewColumnIcon />}
        variant='outlined'
        onClick={handleOpen}
      >
        Columns
        {hasHiddenColumns && (
          <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>
            ({visibleCount}/{columns.length})
          </span>
        )}
      </Button>
      <ColumnPopover anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
}
