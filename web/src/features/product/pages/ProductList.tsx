import { useRef, useState, useMemo } from "react";
import { PageLayout } from "@/shared/components/PageLayout";
import { PageError } from "@/shared/components/PageError";
import InventoryIcon from "@mui/icons-material/Inventory";
import type { ProductWithStoreName } from "../types";
import {
  BusinessTable,
  type BusinessTableHandle,
  useTableURLSync,
} from "@/shared/components/BusinessTable";
import type {
  TableRequestParams,
  TableResponse,
} from "@/shared/components/BusinessTable";
import { ProductTableHeaderActions } from "../components";
import type { ProductPayload } from "../validation";
import { productService } from "../service";
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from "../hooks";
import { useStores } from "@/features/store/hooks";
import { PRODUCT_CATEGORIES, PRODUCTS_SCHEMA } from "../constants";
import { createProductTableCustomization } from "../utils/formatCellValue";
import { ProductMetaModal } from "@/shared/components/ProductMetaModal/ProductMetaModal";

const categoryOptions = [...PRODUCT_CATEGORIES];

export const ProductList = () => {
  const tableRef = useRef<BusinessTableHandle | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithStoreName | null>(null);
  const [originalProduct, setOriginalProduct] =
    useState<ProductWithStoreName | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);

  const { data: storesData } = useStores();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const { initialState: urlInitialState, handleStateChange } = useTableURLSync({
    enabled: true,
  });

  const storeOptions = useMemo(
    () =>
      storesData?.data.map((store) => ({
        id: String(store.id),
        name: store.name,
      })) || [],
    [storesData]
  );

  const getProductsData = useMemo(
    () =>
      async (params: TableRequestParams): Promise<TableResponse> => {
        const result = await productService.getProducts({
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

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setDetailOpen(true);
  };

  const handleRowClick = (row: ProductWithStoreName) => {
    setSelectedProduct(row);
    setOriginalProduct({ ...row });
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedProduct(null);
    setOriginalProduct(null);
  };

  const handleCreateProduct = async (data: ProductPayload) => {
    try {
      const result = await createProductMutation.mutateAsync({
        storeId: data.storeId,
        name: data.name,
        category: data.category,
        stockQuantity: data.stockQuantity,
        price: data.price,
      });
      const productWithStoreName: ProductWithStoreName = {
        ...result,
        storeName: storesData?.data.find((s) => s.id === result.storeId)?.name,
      };
      tableRef.current?.upsertRow(result.id, productWithStoreName);
      handleCloseDetail();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleUpdateProduct = async (product: ProductWithStoreName) => {
    try {
      const result = await updateProductMutation.mutateAsync({
        id: product.id,
        data: {
          storeId: product.storeId,
          name: product.name,
          category: product.category,
          stockQuantity: product.stockQuantity,
          price: product.price,
        },
      });
      const productWithStoreName: ProductWithStoreName = {
        ...result,
        storeName: storesData?.data.find((s) => s.id === result.storeId)?.name,
      };
      tableRef.current?.updateRow(result.id, productWithStoreName);
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

  return (
    <PageLayout
      title='Products'
      headerIcon={<InventoryIcon />}
      headerActions={
        <ProductTableHeaderActions onNewProduct={handleNewProduct} />
      }
    >
      <BusinessTable
        ref={tableRef}
        schema={PRODUCTS_SCHEMA}
        processingMode='server'
        getData={getProductsData}
        getRowId={(row) => (row?.id as string) || String(Math.random())}
        onRowClick={handleRowClick}
        onStateChange={handleStateChange}
        initialState={urlInitialState}
        customization={createProductTableCustomization()}
        slots={{
          ErrorState: ({ error, refetch }) => (
            <PageError
              title='Failed to load products'
              message={
                error.message || "Unable to fetch products. Please try again."
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
          enablePersistStateInURL: true,
        }}
      />
      <ProductMetaModal
        open={isDetailOpen}
        mode={selectedProduct ? "edit" : "create"}
        product={selectedProduct}
        storeOptions={storeOptions}
        categoryOptions={categoryOptions}
        onClose={handleCloseDetail}
        onCreate={handleCreateProduct}
        onUpdate={handleUpdateProduct}
        onDelete={selectedProduct ? handleDeleteProduct : undefined}
      />
    </PageLayout>
  );
};
