import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/shared/components/PageLayout";
import StoreIcon from "@mui/icons-material/Store";
import {
  BusinessTable,
  type BusinessTableHandle,
} from "@/shared/components/BusinessTable";
import type {
  TableSchema,
  TableRequestParams,
  TableResponse,
  TableCustomization,
  Column,
} from "@/shared/components/BusinessTable";
import { StoreTableHeaderActions } from "../components";
import type { Store, StoreId } from "@/core/models/store/model";
import { EditStoreModal } from "@/shared/components/EditStoreModal";
import { storeSeedData } from "../data/stores";
import { StoreId as StoreIdComponent } from "../components/ui";

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

// Mock data service - replace with real API call later
const getStoresData = async (
  params: TableRequestParams
): Promise<TableResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const mockStores: Store[] = storeSeedData.map((store) => ({ ...store }));

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
  const tableRef = useRef<BusinessTableHandle | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleExport = () => {
    console.log("Export stores");
    // TODO: Implement export functionality
  };

  const handleNewStore = () => {
    setSelectedStore(null);
    setModalOpen(true);
  };

  const handleRowClick = (row: Store) => {
    setSelectedStore(row);
    setModalOpen(true);
  };

  const handleFiltersChange = (filters: any[]) => {
    // Update URL or perform other side effects
    console.log("Filters changed:", filters);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStore(null);
  };

  const handleSaveStore = (store: Store) => {
    if (selectedStore) {
      tableRef.current?.updateRow(store.id, store);
      const seedIndex = storeSeedData.findIndex((seed) => seed.id === store.id);
      if (seedIndex >= 0) {
        storeSeedData[seedIndex] = { ...storeSeedData[seedIndex], ...store };
      }
    } else {
      tableRef.current?.upsertRow(store.id, store);
      storeSeedData.push(store);
    }
    handleCloseModal();
  };

  const handleDeleteStore = (storeId: StoreId) => {
    tableRef.current?.deleteRow(storeId);
    handleCloseModal();
  };

  const handleOnClickStoreId = (
    e: React.MouseEvent<HTMLDivElement>,
    store: Store
  ) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/stores/${store.id}`);
  };

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

      if (column.field === "createdAt" || column.field === "updatedAt") {
        if (value) {
          return new Date(value as string).toLocaleDateString();
        }
      }
      if (column.field === "id") {
        return (
          <StoreIdComponent
            isLink
            onClick={(e) => handleOnClickStoreId(e, rowData)}
          >
            {value}
          </StoreIdComponent>
        );
      }

      return value ?? "-";
    },
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
        ref={tableRef}
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
      <EditStoreModal
        open={isModalOpen}
        store={selectedStore}
        onClose={handleCloseModal}
        onSave={handleSaveStore}
        onDelete={handleDeleteStore}
      />
    </PageLayout>
  );
};
