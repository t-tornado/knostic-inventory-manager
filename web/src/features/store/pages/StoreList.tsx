import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/shared/components/PageLayout";
import { PageError } from "@/shared/components/PageError";
import StoreIcon from "@mui/icons-material/Store";
import type { Store } from "@/core/models/store/model";
import {
  BusinessTable,
  type BusinessTableHandle,
} from "@/shared/components/BusinessTable";
import type {
  TableRequestParams,
  TableResponse,
} from "@/shared/components/BusinessTable";
import { StoreTableHeaderActions } from "../components";
import { StoreMetaModal } from "@/shared/components/StoreMetaModal";
import type { StorePayload } from "../utils/validation";
import { storeService } from "../service";
import { useCreateStore, useUpdateStore, useDeleteStore } from "../hooks";
import {
  formatStoreFieldLabel,
  createRenderStoreCellValue,
} from "../utils/formatCellValue";
import { STORES_TABLE_SCHEMA } from "../consts";

export const StoreList = () => {
  const tableRef = useRef<BusinessTableHandle | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [originalStore, setOriginalStore] = useState<Store | null>(null);
  const navigate = useNavigate();

  const getStoresData = useCallback(
    async (params: TableRequestParams): Promise<TableResponse> => {
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

  const handleNewStore = () => {
    setSelectedStore(null);
    setModalOpen(true);
  };

  const handleRowClick = (row: Store) => {
    setSelectedStore(row);
    setOriginalStore({ ...row });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStore(null);
    setOriginalStore(null);
  };

  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore();
  const deleteStoreMutation = useDeleteStore();

  const handleCreateStore = async (data: StorePayload) => {
    try {
      await createStoreMutation.mutateAsync({
        name: data.name,
      });
      handleCloseModal();
    } catch {
      // donothing
    }
  };

  const handleUpdateStore = async (store: Store) => {
    try {
      await updateStoreMutation.mutateAsync({
        id: store.id,
        data: { name: store.name },
      });
      handleCloseModal();
    } catch {
      if (originalStore) {
        setSelectedStore(originalStore);
        setModalOpen(true);
      }
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    try {
      await deleteStoreMutation.mutateAsync(storeId);
      handleCloseModal();
    } catch {
      // donothing
    }
  };

  const handleOnClickStoreId = (
    e: React.MouseEvent<HTMLDivElement>,
    store: Store
  ) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/stores/${store.id}`);
  };

  const renderStoreCellValue = createRenderStoreCellValue(handleOnClickStoreId);

  return (
    <PageLayout
      title='Stores'
      headerIcon={<StoreIcon />}
      headerActions={<StoreTableHeaderActions onNewStore={handleNewStore} />}
    >
      <BusinessTable
        ref={tableRef}
        schema={STORES_TABLE_SCHEMA}
        getData={getStoresData}
        getRowId={(row) => (row?.id as string) || String(Math.random())}
        onRowClick={(row: unknown) => handleRowClick(row as Store)}
        customization={{
          formatFieldLabel: formatStoreFieldLabel,
          renderCellValue: renderStoreCellValue,
        }}
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
      <StoreMetaModal
        open={isModalOpen}
        mode={selectedStore ? "edit" : "create"}
        store={selectedStore}
        onClose={handleCloseModal}
        onCreate={handleCreateStore}
        onUpdate={handleUpdateStore}
        onDelete={selectedStore ? handleDeleteStore : undefined}
      />
    </PageLayout>
  );
};
