import { useRef, useState, useMemo } from "react";
import { PageLayout } from "@/shared/components/PageLayout";
import { PageError } from "@/shared/components/PageError";
import InventoryIcon from "@mui/icons-material/Inventory";
import type { ProductWithStoreName } from "../types";
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
import { ProductTableHeaderActions } from "../components";
import { EditProductModal } from "@/shared/components/EditProductModal";
import { productService } from "../service";
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from "../hooks";
import { useStores } from "@/features/store/hooks";
import { PRODUCT_CATEGORIES } from "../constants";

// Define the table schema for products
const productsSchema: TableSchema = {
  products: {
    id: {
      value_types: ["string"],
      values: [],
    },
    name: {
      value_types: ["string"],
      values: [],
    },
    storeName: {
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

// Customization for formatting
const tableCustomization: TableCustomization = {
  formatFieldLabel: (field: string) => {
    const labels: Record<string, string> = {
      id: "ID",
      name: "Product Name",
      storeName: "Store",
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

    // Format price as currency
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

  const storeOptions = useMemo(
    () =>
      storesData?.data.map((store) => ({
        id: store.id,
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

  const handleExport = () => {
    console.log("Export products");
    // TODO: Implement export functionality
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setDetailOpen(true);
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

  const handleSaveProduct = async (product: ProductWithStoreName) => {
    try {
      if (selectedProduct) {
        // Editing existing product
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
          storeName: storesData?.data.find((s) => s.id === result.storeId)
            ?.name,
        };
        tableRef.current?.updateRow(result.id, productWithStoreName);
        handleCloseDetail();
      } else {
        // Creating new product
        const result = await createProductMutation.mutateAsync({
          storeId: product.storeId,
          name: product.name,
          category: product.category,
          stockQuantity: product.stockQuantity,
          price: product.price,
        });
        const productWithStoreName: ProductWithStoreName = {
          ...result,
          storeName: storesData?.data.find((s) => s.id === result.storeId)
            ?.name,
        };
        tableRef.current?.upsertRow(result.id, productWithStoreName);
        handleCloseDetail();
      }
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
        <ProductTableHeaderActions
          onExport={handleExport}
          onNewProduct={handleNewProduct}
        />
      }
    >
      <BusinessTable
        ref={tableRef}
        schema={productsSchema}
        processingMode='server'
        getData={getProductsData}
        getRowId={(row) => (row?.id as string) || String(Math.random())}
        onRowClick={handleRowClick}
        onFiltersChange={handleFiltersChange}
        customization={tableCustomization}
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
        }}
      />
      <EditProductModal
        open={isDetailOpen}
        product={selectedProduct}
        storeOptions={storeOptions}
        categoryOptions={categoryOptions}
        onClose={handleCloseDetail}
        onSave={handleSaveProduct}
        onDelete={selectedProduct ? handleDeleteProduct : undefined}
      />
    </PageLayout>
  );
};
