import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/shared/components/PageLayout";
import { PageError } from "@/shared/components/PageError";
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
import { StoreId as StoreIdComponent } from "../components/ui";
import { storeService } from "../service";

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

export const StoreList = () => {
  const tableRef = useRef<BusinessTableHandle | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * getStoresData receives all table state parameters from BusinessTable:
   * - filters: JSON stringified array of filters
   * - search: search keyword string
   * - sort: JSON stringified array of sort configurations
   * - page: 1-based page number
   * - pageSize: number of items per page
   *
   * BusinessTable automatically encodes these from its internal state
   * and passes them here whenever the table state changes (filters, search, pagination, sorting)
   */
  const getStoresData = useMemo(
    () =>
      async (params: TableRequestParams): Promise<TableResponse> => {
        // Pass all data manipulation parameters to the service
        const result = await storeService.getStores({
          search: params.search,
          filters: params.filters,
          sort: params.sort,
          page: params.page,
          pageSize: params.pageSize,
        });

        return {
          data: result.data,
          meta: {
            total: result.total,
            page: result.page,
            pageSize: result.pageSize,
          },
        };
      },
    []
  );

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
    } else {
      tableRef.current?.upsertRow(store.id, store);
    }
    handleCloseModal();
    // Table will automatically refetch on next interaction
  };

  const handleDeleteStore = (storeId: StoreId) => {
    tableRef.current?.deleteRow(storeId);
    handleCloseModal();
    // Table will automatically refetch on next interaction
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
        slots={{
          ErrorState: ({ error, refetch }) => (
            <PageError
              title='Failed to load stores'
              message={
                error.message || "Unable to fetch stores. Please try again."
              }
              onRetry={() => refetch()}
            />
          ),
        }}
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
