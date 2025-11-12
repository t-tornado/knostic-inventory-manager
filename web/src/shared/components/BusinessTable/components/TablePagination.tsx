import {
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { usePagination } from "../hooks/usePagination";
import { defaultPageSizes } from "../config/defaults";

interface TablePaginationProps {
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export function TablePagination({ meta }: TablePaginationProps) {
  const { pagination, setPage, setPageSize, currentPage, totalPages } =
    usePagination();

  if (!meta) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FormControl size='small' sx={{ minWidth: 120 }}>
          <InputLabel>Page Size</InputLabel>
          <Select
            value={pagination.pageSize}
            label='Page Size'
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {defaultPageSizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
          Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
          {Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            meta.total
          )}{" "}
          of {meta.total} results
        </Box>
      </Box>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => setPage(page - 1)} // Convert to 0-based
        color='primary'
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
