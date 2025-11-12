import { useRef, useState } from "react";
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
import type { ProductId } from "@/core/models/product/model";
import type { ISODateTime, Price } from "@/core/models/ValueObjects";
import { storeSeedData } from "@/features/store/data/stores";
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

// Mock data service - replace with real API call later
const getProductsData = async (
  params: TableRequestParams
): Promise<TableResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock data based on prototype
  const mockProducts: ProductWithStoreName[] = [
    {
      id: "PRD-001" as ProductId,
      storeId: "1" as any,
      name: 'Laptop Pro 15"',
      storeName: "Main Store",
      category: "Electronics",
      stockQuantity: 23,
      price: 1299.99 as Price,
      createdAt: "2024-01-15T10:00:00Z" as ISODateTime,
      updatedAt: "2024-01-20T14:30:00Z" as ISODateTime,
    },
    {
      id: "PRD-002" as ProductId,
      storeId: "1" as any,
      name: "Wireless Mouse",
      storeName: "Main Store",
      category: "Accessories",
      stockQuantity: 45,
      price: 29.99 as Price,
      createdAt: "2024-01-16T09:00:00Z" as ISODateTime,
      updatedAt: "2024-01-21T11:20:00Z" as ISODateTime,
    },
    {
      id: "PRD-003" as ProductId,
      storeId: "3" as any,
      name: "USB-C Cable",
      storeName: "Tech Hub",
      category: "Cables",
      stockQuantity: 8,
      price: 12.99 as Price,
      createdAt: "2024-01-17T08:00:00Z" as ISODateTime,
      updatedAt: "2024-01-22T16:45:00Z" as ISODateTime,
    },
    {
      id: "PRD-004" as ProductId,
      storeId: "1" as any,
      name: "Gaming Keyboard",
      storeName: "Main Store",
      category: "Accessories",
      stockQuantity: 32,
      price: 89.99 as Price,
      createdAt: "2024-01-18T10:30:00Z" as ISODateTime,
      updatedAt: "2024-01-23T09:15:00Z" as ISODateTime,
    },
    {
      id: "PRD-005" as ProductId,
      storeId: "2" as any,
      name: 'Monitor 27" 4K',
      storeName: "Downtown Branch",
      category: "Electronics",
      stockQuantity: 15,
      price: 449.99 as Price,
      createdAt: "2024-01-19T11:00:00Z" as ISODateTime,
      updatedAt: "2024-01-24T13:30:00Z" as ISODateTime,
    },
    {
      id: "PRD-006" as ProductId,
      storeId: "1" as any,
      name: "Webcam HD",
      storeName: "Main Store",
      category: "Accessories",
      stockQuantity: 28,
      price: 79.99 as Price,
      createdAt: "2024-01-20T12:00:00Z" as ISODateTime,
      updatedAt: "2024-01-25T10:00:00Z" as ISODateTime,
    },
    {
      id: "PRD-007" as ProductId,
      storeId: "3" as any,
      name: "SSD 1TB",
      storeName: "Tech Hub",
      category: "Hardware",
      stockQuantity: 52,
      price: 129.99 as Price,
      createdAt: "2024-01-21T13:00:00Z" as ISODateTime,
      updatedAt: "2024-01-26T15:20:00Z" as ISODateTime,
    },
    {
      id: "PRD-008" as ProductId,
      storeId: "4" as any,
      name: "RAM 16GB DDR4",
      storeName: "West Branch",
      category: "Hardware",
      stockQuantity: 67,
      price: 89.99 as Price,
      createdAt: "2024-01-22T14:00:00Z" as ISODateTime,
      updatedAt: "2024-01-27T11:45:00Z" as ISODateTime,
    },
    {
      id: "PRD-009" as ProductId,
      storeId: "5" as any,
      name: "Mechanical Mouse",
      storeName: "East Branch",
      category: "Accessories",
      stockQuantity: 41,
      price: 49.99 as Price,
      createdAt: "2024-01-23T15:00:00Z" as ISODateTime,
      updatedAt: "2024-01-28T12:30:00Z" as ISODateTime,
    },
    {
      id: "PRD-010" as ProductId,
      storeId: "3" as any,
      name: "Graphics Card RTX 4080",
      storeName: "Tech Hub",
      category: "Hardware",
      stockQuantity: 12,
      price: 1199.99 as Price,
      createdAt: "2024-01-24T16:00:00Z" as ISODateTime,
      updatedAt: "2024-01-29T13:15:00Z" as ISODateTime,
    },
    // Add more products to reach ~1247 total (as shown in prototype pagination)
    ...Array.from({ length: 1237 }, (_, i) => ({
      id: `PRD-${String(i + 11).padStart(3, "0")}` as ProductId,
      storeId: String((i % 8) + 1) as any,
      name: `Product ${i + 11}`,
      storeName: [
        "Main Store",
        "Downtown Branch",
        "Tech Hub",
        "West Branch",
        "East Branch",
        "North Plaza",
        "South Center",
        "Central Mall",
      ][i % 8],
      category: ["Electronics", "Accessories", "Cables", "Hardware"][i % 4],
      stockQuantity: Math.floor(Math.random() * 100) + 1,
      price: (Math.random() * 1000 + 10) as Price,
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString() as ISODateTime,
      updatedAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString() as ISODateTime,
    })),
  ];

  // Apply filters (simplified - in real app, this would be done server-side)
  let filtered = [...mockProducts];

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.storeName?.toLowerCase().includes(searchLower) ||
        product.id.toLowerCase().includes(searchLower)
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
          let aVal: any = (a as any)[sort.id];
          let bVal: any = (b as any)[sort.id];

          // Handle storeName field
          if (sort.id === "storeName") {
            aVal = a.storeName || "";
            bVal = b.storeName || "";
          }

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

const storeOptions = storeSeedData.map((store) => ({
  id: store.id,
  name: store.name,
}));

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
    // Update URL or perform other side effects
    console.log("Filters changed:", filters);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = (updatedProduct: ProductWithStoreName) => {
    if (!updatedProduct) return;
    const payload: ProductWithStoreName = {
      ...updatedProduct,
      updatedAt: new Date().toISOString() as ISODateTime,
    };
    tableRef.current?.updateRow(payload.id, payload);
    handleCloseDetail();
  };

  const handleDeleteProduct = (productId: string) => {
    tableRef.current?.deleteRow(productId);
    handleCloseDetail();
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
