import {
  Popover,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { useColumns } from "../hooks/useColumns";

interface ColumnPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export function ColumnPopover({ anchorEl, onClose }: ColumnPopoverProps) {
  const { columns, isColumnVisible, toggleColumn } = useColumns();

  const open = Boolean(anchorEl);

  const handleToggle = (columnId: string) => {
    toggleColumn(columnId);
  };

  const handleShowAll = () => {
    columns.forEach((col) => {
      if (!isColumnVisible(col.id)) {
        toggleColumn(col.id);
      }
    });
  };

  const handleHideAll = () => {
    columns.forEach((col) => {
      if (isColumnVisible(col.id)) {
        toggleColumn(col.id);
      }
    });
  };

  const visibleCount = columns.filter((col) => isColumnVisible(col.id)).length;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Box sx={{ p: 2, minWidth: 250, maxWidth: 400 }}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant='subtitle2' fontWeight={600}>
              Columns
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {visibleCount} of {columns.length} visible
            </Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            <Stack spacing={0.5}>
              {columns.map((column) => (
                <FormControlLabel
                  key={column.id}
                  control={
                    <Checkbox
                      checked={isColumnVisible(column.id)}
                      onChange={() => handleToggle(column.id)}
                      size='small'
                    />
                  }
                  label={
                    <Typography variant='body2' sx={{ fontSize: 13 }}>
                      {column.label}
                    </Typography>
                  }
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      flex: 1,
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Divider />

          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <Button size='small' onClick={handleHideAll}>
              Hide All
            </Button>
            <Button size='small' onClick={handleShowAll}>
              Show All
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Popover>
  );
}
