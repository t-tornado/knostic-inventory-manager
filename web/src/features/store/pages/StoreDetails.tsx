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
import { EditProductModal } from "@/shared/components/EditProductModal";
import { EditStoreModal } from "@/shared/components/EditStoreModal";
import type { ProductWithStoreName } from "@/features/product/types";
import { useStoreDetails, useUpdateStore, useDeleteStore } from "../hooks";
import { useUpdateProduct, useDeleteProduct } from "@/features/product/hooks";
import { storeService } from "../service";
import { PageError } from "@/shared/components/PageError";
import { PageLoader } from "@/shared/components/PageLoader";
import type { Store } from "@/core/models/store/model";

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
      values: [
        "Electronics",
        "Accessories",
        "Cables",
        "Hardware",
        "Software",
        "Other",
      ],
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

    // Format dates
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
  const tableRef = useRef<BusinessTableHandle | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithStoreName | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);

  // Get store info and stats from API
  const storeInfo = storeDetails?.store;
  const stats = storeDetails?.stats;

  const createdDate = storeInfo
    ? new Date(storeInfo.createdAt).toLocaleDateString(undefined, {
        dateStyle: "medium",
      })
    : "";

  const handleEditStore = () => {
    setStoreModalOpen(true);
  };

  const handleAddProduct = () => {
    console.log("Add product");
    // TODO: Navigate to add product page or open modal
  };

  const handleRowClick = (row: ProductWithStoreName) => {
    setSelectedProduct(row);
    setDetailOpen(true);
  };

  const handleFiltersChange = (filters: any[]) => {
    console.log("Filters changed:", filters);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedProduct(null);
  };

  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateStoreMutation = useUpdateStore();
  const deleteStoreMutation = useDeleteStore();

  const handleSaveProduct = async (updatedProduct: ProductWithStoreName) => {
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
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      tableRef.current?.deleteRow(productId);
      handleCloseDetail();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleSaveStoreInfo = async (store: Store) => {
    try {
      await updateStoreMutation.mutateAsync({
        id: store.id,
        data: { name: store.name },
      });
      await refetchStoreDetails();
      setStoreModalOpen(false);
    } catch (error) {
      console.error("Failed to update store:", error);
    }
  };

  const handleDeleteStoreInfo = async (storeId: string) => {
    try {
      await deleteStoreMutation.mutateAsync(storeId);
      setStoreModalOpen(false);
      navigate("/stores");
    } catch (error) {
      console.error("Failed to delete store:", error);
    }
  };

  // Get store options for product modal - we'll need to fetch all stores
  // For now, use the current store
  const storeOptions = storeInfo
    ? [
        {
          id: storeInfo.id,
          name: storeInfo.name,
        },
      ]
    : [];

  const categoryOptions = storeProductsSchema.products.category
    .values as string[];

  // Create getData function that calls the API
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

        // Map products to include storeName for compatibility
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

  // Show loading state
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

  // Show error state
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
      <EditProductModal
        open={isDetailOpen}
        product={selectedProduct}
        storeOptions={storeOptions}
        categoryOptions={categoryOptions}
        onClose={handleCloseDetail}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
      <EditStoreModal
        open={isStoreModalOpen}
        store={storeInfo}
        onClose={() => setStoreModalOpen(false)}
        onSave={handleSaveStoreInfo}
        onDelete={handleDeleteStoreInfo}
      />
    </PageLayout>
  );
};
