# BusinessTable Component

A schema-driven, feature-rich data table component with improved architecture, better maintainability, and comprehensive features. Built on top of Material React Table for enhanced UI capabilities while maintaining full control over data management.

## Features

- ✅ Schema-driven design
- ✅ Server-side and client-side data processing
- ✅ Advanced filtering system with custom operators
- ✅ Column management (show/hide, reorder, resize, sort)
- ✅ Global search
- ✅ Pagination
- ✅ Row selection with manual ID assignment
- ✅ Grouping support
- ✅ Type-safe with TypeScript
- ✅ TanStack Query integration
- ✅ Material React Table UI (hybrid approach)
- ✅ Manual row ID assignment for stable row identity

## Usage

### Basic Example

```typescript
import { BusinessTable } from "@/shared/components/BusinessTable";

const schema = {
  users: {
    id: {
      value_types: ["number"],
      values: [],
    },
    name: {
      value_types: ["string"],
      values: [],
    },
    email: {
      value_types: ["string"],
      values: [],
    },
    status: {
      value_types: ["enum"],
      values: ["active", "inactive", "pending"],
    },
  },
};

function MyTable() {
  return (
    <BusinessTable
      schema={schema}
      processingMode='client'
      data={myData}
      getRowId={(row) => row.id} // Optional: assign stable IDs to rows
      features={{
        enableFiltering: true,
        enableSearching: true,
        enableColumnSorting: true,
      }}
    />
  );
}
```

### Row ID Assignment

The `getRowId` prop allows you to assign stable IDs to table rows. This is useful when you need to:

- Update rows from outside the table while maintaining row identity
- Track specific rows across data updates
- Implement row-level operations that require stable references

```typescript
<BusinessTable
  schema={schema}
  data={myData}
  getRowId={(row) => row.id} // Use row's id field
  // or
  getRowId={(row) => `${row.source}-${row.id}`} // Composite key
/>
```

### Server-Side Example

```typescript
import { BusinessTable } from "@/shared/components/BusinessTable";
import type {
  TableRequestParams,
  TableResponse,
} from "@/shared/components/BusinessTable";

// Define your getData service function
const getData = async (params: TableRequestParams): Promise<TableResponse> => {
  // Build query string from params
  const queryParams = new URLSearchParams();
  if (params.filters) queryParams.append("filters", params.filters);
  if (params.search) queryParams.append("search", params.search);
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.page) queryParams.append("page", String(params.page));
  if (params.pageSize) queryParams.append("pageSize", String(params.pageSize));

  const response = await fetch(`/api/table-data?${queryParams.toString()}`, {
    headers: {
      Authorization: "Bearer token",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

function MyTable() {
  return (
    <BusinessTable
      schema={schema}
      processingMode='server'
      getData={getData}
      features={{
        enableFiltering: true,
        enableSearching: true,
      }}
    />
  );
}
```

## Configuration

### TableSchema

The schema defines available fields and their properties:

```typescript
interface TableSchema {
  [source: string]: {
    [field: string]: {
      value_types: string[]; // e.g., ["string", "number", "enum"]
      values: string[] | number[]; // Available values for enum/select fields
      types?: string[]; // Optional additional type information
    };
  };
}
```

### Features

Control which features are enabled:

```typescript
features={{
  enableFiltering: boolean;
  enableSearching: boolean;
  enableGrouping: boolean;
  enableDynamicColumns: boolean;
  enableBulkActions: boolean;
  enableRowActions: boolean;
  enableColumnSorting: boolean;
  enablePersistStateInURL: boolean;
  enableSavedTablePreferences: boolean;
  enableColumnResizing: boolean;
  enableColumnReordering: boolean;
}}
```

### Customization

Customize rendering and behavior:

```typescript
customization={{
  formatFieldLabel: (field: string, source?: string) => string;
  renderCellValue: (column, rowData, setRowData) => ReactNode;
  renderColumnHeader: (column) => ReactNode;
  renderRowActions: (rowData) => ReactNode;
  renderBulkActions: (selectedRows) => ReactNode;
  formatFilterValue: (field: string, value: any) => string;
  validateFilter: (filter: Filter) => boolean | string;
}}
```

## Architecture

### Directory Structure

```
BusinessTable/
├── index.tsx                    # Main export
├── types.ts                     # All TypeScript types
├── config/
│   ├── defaults.ts              # Default configurations
│   └── validators.ts            # Configuration validation
├── context/
│   ├── TableContext.tsx         # Single unified context
│   └── TableProvider.tsx        # Context provider
├── state/
│   ├── reducer.ts               # State reducer
│   ├── actions.ts               # Action creators
│   └── selectors.ts             # State selectors
├── hooks/
│   ├── useTableState.ts         # Main state hook
│   ├── useTableData.ts          # Data fetching hook
│   ├── useFilters.ts            # Filter management
│   ├── useColumns.ts            # Column management
│   └── usePagination.ts        # Pagination logic
├── components/
│   ├── BusinessTable.tsx        # Root component
│   ├── TableControls/           # Top controls bar
│   ├── Table.tsx                # Main table component
│   └── TablePagination.tsx      # Pagination controls
├── utils/
│   └── schema/                  # Schema parsing utilities
└── services/
    ├── ServerDataService.ts     # Server-side data fetching
    └── ClientDataService.ts     # Client-side data processing
```

## State Management

The component uses a single unified context with a reducer pattern:

- **Single Context**: `TableContext` provides all state and actions
- **Grouped Actions**: Actions are organized by feature (filters, columns, pagination, etc.)
- **Type-Safe**: All actions are fully typed
- **Selectors**: Convenient selectors for derived state

## Hooks

### useTableState

Main hook for accessing table state and dispatch:

```typescript
const { state, dispatch, schema, config } = useTableState();
```

### useTableData

Hook for data fetching and processing:

```typescript
const { data, meta, isLoading, error } = useTableData();
```

### useFilters

Hook for filter management:

```typescript
const {
  filters,
  addFilter,
  removeFilter,
  updateFilter,
  clearFilters,
  filterableFields,
} = useFilters();
```

### useColumns

Hook for column management:

```typescript
const { columns, visibleColumns, toggleColumn, reorderColumns, sortColumn } =
  useColumns();
```

### usePagination

Hook for pagination:

```typescript
const {
  pagination,
  setPage,
  setPageSize,
  nextPage,
  previousPage,
  currentPage,
  totalPages,
} = usePagination();
```

## Data Service

The table expects a `getData` function that receives encoded table state parameters:

```typescript
import type {
  TableRequestParams,
  TableResponse,
} from "@/shared/components/BusinessTable";

const getData = async (params: TableRequestParams): Promise<TableResponse> => {
  // params contains:
  // - filters?: string (JSON stringified)
  // - search?: string
  // - searchType?: "exact" | "fuzzy"
  // - sort?: string (JSON stringified)
  // - page?: number (1-based)
  // - pageSize?: number
  // - groupBy?: string (JSON stringified)
  // - columns?: string (JSON stringified)

  // Make your API call with these params
  const response = await fetch(`/api/data?${buildQueryString(params)}`);
  return response.json();
};
```

The table manages the request lifecycle (loading, error states) automatically using TanStack Query.

### Encoding State to URL Params

You can also use the utility to encode state to URLSearchParams:

```typescript
import { encodeTableStateToURLParams } from "@/shared/components/BusinessTable";

const params = encodeTableStateToURLParams(tableState);
const url = `/api/data?${params.toString()}`;
```

## Filter Change Subscription

The table provides an `onFiltersChange` callback that is called whenever active filters change. This is useful for URL state persistence and other side effects:

```typescript
import { BusinessTable } from "@/shared/components/BusinessTable";
import type { Filter } from "@/shared/components/BusinessTable";
import { useSearchParams } from "react-router-dom";

function MyTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFiltersChange = (filters: Filter[]) => {
    // Update URL with current filters
    const params = new URLSearchParams(searchParams);

    if (filters.length > 0) {
      params.set("filters", JSON.stringify(filters));
    } else {
      params.delete("filters");
    }

    setSearchParams(params);
  };

  return (
    <BusinessTable
      schema={schema}
      processingMode='server'
      getData={getData}
      onFiltersChange={handleFiltersChange}
      features={{
        enableFiltering: true,
      }}
    />
  );
}
```

## Future Enhancements

- [ ] State persistence (URL + localStorage) - Use `onFiltersChange` for this
- [ ] Advanced filter UI components
- [ ] Column drag-and-drop reordering
- [ ] Grouping UI
- [ ] Row actions menu
- [ ] Bulk actions
- [ ] Virtual scrolling for large datasets
- [ ] Export functionality
- [ ] Saved table preferences

## Known Limitations

- Grouping UI not yet implemented
- Column reordering UI not yet implemented
- State persistence not yet implemented
- Advanced filter builder not yet implemented

## Contributing

When adding new features:

1. Add types to `types.ts`
2. Add actions to `state/actions.ts`
3. Add reducer cases to `state/reducer.ts`
4. Create hooks in `hooks/`
5. Add UI components in `components/`
6. Update this README
