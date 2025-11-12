import { PageLayout } from "@/app/layout";
import StoreIcon from "@mui/icons-material/Store";
import { BusinessTable } from "@/shared/components/BusinessTable";
import type {
  TableSchema,
  TableRequestParams,
  TableResponse,
  TableCustomization,
  Column,
} from "@/shared/components/BusinessTable";
import { StoreTableHeaderActions } from "../components";
import type { Store, StoreId } from "@/core/models/store/model";
import type { ISODateTime } from "@/core/models/ValueObjects";

// Define the table schema for stores
const storesSchema: TableSchema = {
  stores: {
    id: {
      value_types: ["string"],
      values: [],
    },
    name: {
      value_types: ["string"],
      values: [],
    },
    createdAt: {
      value_types: ["date"],
      values: [],
    },
    updatedAt: {
      value_types: ["date"],
      values: [],
    },
  },
};

// Customization for date formatting
const tableCustomization: TableCustomization = {
  formatFieldLabel: (field: string) => {
    const labels: Record<string, string> = {
      id: "ID",
      name: "Store Name",
      createdAt: "Created At",
      updatedAt: "Updated At",
    };
    return labels[field] || field;
  },
  renderCellValue: (column: Column, rowData: any) => {
    const value = column.accessor(rowData);

    // Format dates
    if (column.field === "createdAt" || column.field === "updatedAt") {
      if (value) {
        return new Date(value as string).toLocaleDateString();
      }
    }

    return value ?? "-";
  },
};

// Mock data service - replace with real API call later
const getStoresData = async (
  params: TableRequestParams
): Promise<TableResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock data
  const mockStores: Store[] = [
    {
      id: "1" as StoreId,
      name: "Main Store",
      createdAt: "2024-01-15T10:00:00Z" as ISODateTime,
      updatedAt: "2024-01-20T14:30:00Z" as ISODateTime,
    },
    {
      id: "2" as StoreId,
      name: "Downtown Branch",
      createdAt: "2024-01-16T09:00:00Z" as ISODateTime,
      updatedAt: "2024-01-21T11:20:00Z" as ISODateTime,
    },
    {
      id: "3" as StoreId,
      name: "Tech Hub",
      createdAt: "2024-01-17T08:00:00Z" as ISODateTime,
      updatedAt: "2024-01-22T16:45:00Z" as ISODateTime,
    },
    {
      id: "4" as StoreId,
      name: "West Branch",
      createdAt: "2024-01-18T10:30:00Z" as ISODateTime,
      updatedAt: "2024-01-23T09:15:00Z" as ISODateTime,
    },
    {
      id: "5" as StoreId,
      name: "East Branch",
      createdAt: "2024-01-19T11:00:00Z" as ISODateTime,
      updatedAt: "2024-01-24T13:30:00Z" as ISODateTime,
    },
    {
      id: "6" as StoreId,
      name: "North Plaza",
      createdAt: "2024-01-20T12:00:00Z" as ISODateTime,
      updatedAt: "2024-01-25T10:00:00Z" as ISODateTime,
    },
    {
      id: "7" as StoreId,
      name: "South Center",
      createdAt: "2024-01-21T13:00:00Z" as ISODateTime,
      updatedAt: "2024-01-26T15:20:00Z" as ISODateTime,
    },
    {
      id: "8" as StoreId,
      name: "Central Mall",
      createdAt: "2024-01-22T14:00:00Z" as ISODateTime,
      updatedAt: "2024-01-27T11:45:00Z" as ISODateTime,
    },
  ];

  // Apply filters (simplified - in real app, this would be done server-side)
  let filtered = [...mockStores];

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter((store) =>
      store.name.toLowerCase().includes(searchLower)
    );
  }

  if (params.filters) {
    try {
      const filters = JSON.parse(params.filters);
      // Apply filter logic here
      // This is simplified - real implementation would handle all operators
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filters.forEach((_filter: any) => {
        // TODO: Implement filter logic
      });
    } catch {
      // Invalid filters - ignore
    }
  }

  // Apply sorting
  if (params.sort) {
    try {
      const sorting = JSON.parse(params.sort);
      if (sorting.length > 0) {
        const sort = sorting[0];
        filtered.sort((a, b) => {
          const aVal = (a as any)[sort.id];
          const bVal = (b as any)[sort.id];
          const multiplier = sort.direction === "asc" ? 1 : -1;
          if (aVal < bVal) return -1 * multiplier;
          if (aVal > bVal) return 1 * multiplier;
          return 0;
        });
      }
    } catch {
      // Invalid sort - ignore
    }
  }

  // Apply pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 25;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);

  return {
    data: paginated,
    meta: {
      total: filtered.length,
      page,
      pageSize,
    },
  };
};

export const StoreList = () => {
  const handleExport = () => {
    console.log("Export stores");
    // TODO: Implement export functionality
  };

  const handleNewStore = () => {
    console.log("New store");
    // TODO: Navigate to new store page or open modal
  };

  const handleRowClick = (row: Store) => {
    console.log("Row clicked:", row);
    // TODO: Navigate to store details
  };

  const handleFiltersChange = (filters: any[]) => {
    // Update URL or perform other side effects
    console.log("Filters changed:", filters);
  };

  return (
    <PageLayout
      title='Stores'
      headerIcon={<StoreIcon />}
      headerActions={
        <StoreTableHeaderActions
          onExport={handleExport}
          onNewStore={handleNewStore}
        />
      }
    >
      <BusinessTable
        schema={storesSchema}
        processingMode='server'
        getData={getStoresData}
        getRowId={(row) => (row?.id as string) || String(Math.random())}
        onRowClick={handleRowClick}
        onFiltersChange={handleFiltersChange}
        customization={tableCustomization}
        features={{
          enableFiltering: true,
          enableSearching: true,
          enableColumnSorting: true,
          enableColumnResizing: true,
          enableColumnReordering: true,
        }}
      />
    </PageLayout>
  );
};
