import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
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
import { StoreDetailsHeaderActions } from "../components";
import {
  StoreInfoCard,
  StoreInfoHeader,
  StoreInfoMain,
  StoreIcon as StoreIconComponent,
  StoreInfoDetails,
  StoreName,
  StoreId,
  StoreInfoActions,
  StoreStats,
  StoreStat,
} from "../components/atoms";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { StoreMetaModal } from "@/shared/components/StoreMetaModal";
import type { ProductWithStoreName } from "@/features/product/types";
import { useStoreDetails, useUpdateStore, useDeleteStore } from "../hooks";
import { useUpdateProduct, useDeleteProduct } from "@/features/product/hooks";
import { storeService } from "../service";
import { PageError } from "@/shared/components/PageError";
import { PageLoader } from "@/shared/components/PageLoader";
import type { Store } from "@/core/models/store/model";
import { PRODUCT_CATEGORIES } from "@/features/product/constants";
import { ProductMetaModal } from "@/shared/components/ProductMetaModal/ProductMetaModal";

const storeProductsSchema: TableSchema = {
  products: {
    id: {
      value_types: ["string"],
      values: [],
    },
    name: {
      value_types: ["string"],
      values: [],
    },
    category: {
      value_types: ["string", "enum"],
      values: [...PRODUCT_CATEGORIES],
    },
    stockQuantity: {
      value_types: ["number"],
      values: [],
    },
    price: {
      value_types: ["number"],
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

const tableCustomization: TableCustomization = {
  formatFieldLabel: (field: string) => {
    const labels: Record<string, string> = {
      id: "ID",
      name: "Product Name",
      category: "Category",
      stockQuantity: "Stock Quantity",
      price: "Price",
      createdAt: "Created At",
      updatedAt: "Updated At",
    };
    return labels[field] || field;
  },
  renderCellValue: (column: Column, rowData: any) => {
    const value = column.accessor(rowData);

    if (column.field === "price") {
      if (value !== null && value !== undefined) {
        return `$${Number(value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
      return "-";
    }

    if (column.field === "createdAt" || column.field === "updatedAt") {
      if (value) {
        return new Date(value as string).toLocaleDateString();
      }
    }

    return value ?? "-";
  },
};

export const StoreDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storeId = id || "";

  const {
    data: storeDetails,
    isLoading: isLoadingDetails,
    error: storeDetailsError,
    refetch: refetchStoreDetails,
  } = useStoreDetails(storeId, { enabled: !!storeId });

  const [isStoreModalOpen, setStoreModalOpen] = useState(false);
  const [originalStore, setOriginalStore] = useState<Store | null>(null);
  const tableRef = useRef<BusinessTableHandle | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithStoreName | null>(null);
  const [originalProduct, setOriginalProduct] =
    useState<ProductWithStoreName | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);

  const storeInfo = storeDetails?.store;
  const stats = storeDetails?.stats;

  const createdDate = storeInfo
    ? new Date(storeInfo.createdAt).toLocaleDateString(undefined, {
        dateStyle: "medium",
      })
    : "";

  const handleEditStore = () => {
    if (storeInfo) {
      setOriginalStore({ ...storeInfo });
    }
    setStoreModalOpen(true);
  };

  const handleAddProduct = () => {
    console.log("Add product");
  };

  const handleRowClick = (row: ProductWithStoreName) => {
    setSelectedProduct(row);
    setOriginalProduct({ ...row });
    setDetailOpen(true);
  };

  const handleFiltersChange = (filters: any[]) => {
    console.log("Filters changed:", filters);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedProduct(null);
    setOriginalProduct(null);
  };

  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateStoreMutation = useUpdateStore();
  const deleteStoreMutation = useDeleteStore();

  const handleUpdateProduct = async (updatedProduct: ProductWithStoreName) => {
    try {
      await updateProductMutation.mutateAsync({
        id: updatedProduct.id,
        data: {
          storeId: updatedProduct.storeId,
          name: updatedProduct.name,
          category: updatedProduct.category,
          stockQuantity: updatedProduct.stockQuantity,
          price: updatedProduct.price,
        },
      });
      tableRef.current?.updateRow(updatedProduct.id, updatedProduct);
      handleCloseDetail();
    } catch {
      if (originalProduct) {
        setSelectedProduct(originalProduct);
        setDetailOpen(true);
        tableRef.current?.updateRow(originalProduct.id, originalProduct);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const productToDelete = selectedProduct;
    try {
      await deleteProductMutation.mutateAsync(productId);
      tableRef.current?.deleteRow(productId);
      handleCloseDetail();
    } catch {
      if (productToDelete) {
        tableRef.current?.upsertRow(productToDelete.id, productToDelete);
      }
    }
  };

  const handleUpdateStoreInfo = async (store: Store) => {
    try {
      await updateStoreMutation.mutateAsync({
        id: store.id,
        data: { name: store.name },
      });
      await refetchStoreDetails();
      setStoreModalOpen(false);
      setOriginalStore(null);
    } catch {
      if (originalStore) {
        setStoreModalOpen(true);
      }
    }
  };

  const handleDeleteStoreInfo = async (storeId: string) => {
    try {
      await deleteStoreMutation.mutateAsync(storeId);
      setStoreModalOpen(false);
      navigate("/stores");
    } catch {
      setStoreModalOpen(false);
    }
  };

  const storeOptions = storeInfo
    ? [
        {
          id: storeInfo.id,
          name: storeInfo.name,
        },
      ]
    : [];

  const categoryOptions = [...PRODUCT_CATEGORIES];

  const getData = useMemo(
    () =>
      async (params: TableRequestParams): Promise<TableResponse> => {
        const result = await storeService.getStoreProducts(storeId, {
          search: params.search,
          filters: params.filters,
          sort: params.sort,
          page: params.page,
          pageSize: params.pageSize,
        });

        const productsWithStoreName: ProductWithStoreName[] = result.data.map(
          (product) => ({
            ...product,
            storeName: storeInfo?.name,
          })
        );

        return {
          data: productsWithStoreName,
          meta: {
            total: result.total,
            page: result.page,
            pageSize: result.pageSize,
          },
        };
      },
    [storeId, storeInfo?.name]
  );

  if (isLoadingDetails) {
    return (
      <PageLayout
        title='Store Details'
        headerIcon={<StoreIcon />}
        headerActions={
          <StoreDetailsHeaderActions onAddProduct={handleAddProduct} />
        }
      >
        <PageLoader />
      </PageLayout>
    );
  }

  if (storeDetailsError || !storeInfo) {
    return (
      <PageLayout
        title='Store Details'
        headerIcon={<StoreIcon />}
        headerActions={
          <StoreDetailsHeaderActions onAddProduct={handleAddProduct} />
        }
      >
        <PageError
          title='Failed to load store'
          message={
            storeDetailsError?.message || "Store not found. Please try again."
          }
          onRetry={() => refetchStoreDetails()}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title='Store Details'
      headerIcon={<StoreIcon />}
      headerActions={
        <StoreDetailsHeaderActions onAddProduct={handleAddProduct} />
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          maxHeight: "100%",
          overflow: "hidden",
          gap: 2,
        }}
      >
        <StoreInfoCard>
          <StoreInfoHeader>
            <StoreInfoMain>
              <StoreIconComponent />
              <StoreInfoDetails>
                <StoreName>{storeInfo.name}</StoreName>
                <StoreId>{storeInfo.id}</StoreId>
              </StoreInfoDetails>
            </StoreInfoMain>
            <StoreInfoActions>
              <Button
                variant='outlined'
                startIcon={<EditIcon />}
                onClick={handleEditStore}
                size='small'
              >
                Edit Store
              </Button>
            </StoreInfoActions>
          </StoreInfoHeader>
          <StoreStats>
            <StoreStat
              icon={<InventoryIcon />}
              label='Total Products'
              value={stats?.totalProducts ?? 0}
              iconColor='primary'
            />
            <StoreStat
              icon={<AttachMoneyIcon />}
              label='Total Value'
              value={`$${(stats?.totalValue ?? 0).toLocaleString()}`}
              iconColor='success'
            />
            <StoreStat
              icon={<WarningIcon />}
              label='Low Stock Items'
              value={stats?.lowStockItems ?? 0}
              iconColor='warning'
            />
            <StoreStat
              icon={<CalendarTodayIcon />}
              label='Created'
              value={createdDate}
              iconColor='primary'
            />
          </StoreStats>
        </StoreInfoCard>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            maxHeight: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <BusinessTable
            ref={tableRef}
            schema={storeProductsSchema}
            processingMode='server'
            getData={getData}
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
        </Box>
      </Box>
      {selectedProduct && (
        <ProductMetaModal
          open={isDetailOpen}
          mode='edit'
          product={selectedProduct}
          storeOptions={storeOptions}
          categoryOptions={categoryOptions}
          onClose={handleCloseDetail}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
        />
      )}
      {storeInfo && (
        <StoreMetaModal
          open={isStoreModalOpen}
          mode='edit'
          store={storeInfo}
          onClose={() => setStoreModalOpen(false)}
          onUpdate={handleUpdateStoreInfo}
          onDelete={handleDeleteStoreInfo}
        />
      )}
    </PageLayout>
  );
};
