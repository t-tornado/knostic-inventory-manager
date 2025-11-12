import { useRef, useState, useMemo } from "react";
import { PageLayout } from "@/shared/components/PageLayout";
import InventoryIcon from "@mui/icons-material/Inventory";
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
import { useUpdateProduct, useDeleteProduct } from "../hooks";
import { useStores } from "@/features/store/hooks";
import type { ProductWithStoreName } from "../types";

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

const categoryOptions = [
  "Electronics",
  "Accessories",
  "Cables",
  "Hardware",
  "Software",
  "Other",
];

export const ProductList = () => {
  const tableRef = useRef<BusinessTableHandle | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithStoreName | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);

  const { data: storesData } = useStores();
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

        // Map products to include storeName
        const productsWithStoreName: ProductWithStoreName[] = result.data.map(
          (product) => {
            const store = storesData?.data.find(
              (s) => s.id === product.storeId
            );
            return {
              ...product,
              storeName: store?.name,
            };
          }
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
    [storesData]
  );

  const handleExport = () => {
    console.log("Export products");
    // TODO: Implement export functionality
  };

  const handleNewProduct = () => {
    console.log("New product");
    // TODO: Navigate to new product page or open modal
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

  const handleSaveProduct = async (updatedProduct: ProductWithStoreName) => {
    if (!updatedProduct) return;
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
        onDelete={handleDeleteProduct}
      />
    </PageLayout>
  );
};
