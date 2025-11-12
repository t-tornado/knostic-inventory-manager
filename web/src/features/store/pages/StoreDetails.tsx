import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
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
} from "../components/ui";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { ProductId } from "@/core/models/product/model";
import type { ISODateTime, Price } from "@/core/models/ValueObjects";
import { EditProductModal } from "@/shared/components/EditProductModal";
import type { ProductWithStoreName } from "@/features/product/types";

// Define the table schema for store products (no storeName field needed)
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

// Customization for formatting
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

const storeCatalog = [
  { id: "1", name: "Main Store" },
  { id: "2", name: "Downtown Branch" },
  { id: "3", name: "Tech Hub" },
  { id: "4", name: "West Branch" },
  { id: "5", name: "East Branch" },
  { id: "6", name: "North Plaza" },
  { id: "7", name: "South Center" },
  { id: "8", name: "Central Mall" },
] as const;

const productTemplates = [
  {
    suffix: "01",
    name: 'Laptop Pro 15"',
    category: "Electronics",
    baseStock: 22,
    basePrice: 1299.99,
  },
  {
    suffix: "02",
    name: "Wireless Mouse",
    category: "Accessories",
    baseStock: 40,
    basePrice: 29.99,
  },
  {
    suffix: "03",
    name: "USB-C Cable",
    category: "Cables",
    baseStock: 18,
    basePrice: 12.99,
  },
  {
    suffix: "04",
    name: "Gaming Keyboard",
    category: "Accessories",
    baseStock: 28,
    basePrice: 89.99,
  },
  {
    suffix: "05",
    name: 'Monitor 27" 4K',
    category: "Electronics",
    baseStock: 14,
    basePrice: 449.99,
  },
  {
    suffix: "06",
    name: "Webcam HD",
    category: "Accessories",
    baseStock: 24,
    basePrice: 79.99,
  },
  {
    suffix: "07",
    name: "SSD 1TB",
    category: "Hardware",
    baseStock: 34,
    basePrice: 129.99,
  },
  {
    suffix: "08",
    name: "RAM 16GB DDR4",
    category: "Hardware",
    baseStock: 38,
    basePrice: 89.99,
  },
] as const;

const storeProductsById: Record<string, ProductWithStoreName[]> =
  storeCatalog.reduce((acc, store, storeIndex) => {
    const products = productTemplates.map((template, templateIndex) => {
      const created = new Date(
        Date.UTC(2024, 0, 10 + storeIndex + templateIndex)
      );
      const updated = new Date(
        Date.UTC(2024, 0, 15 + storeIndex + templateIndex)
      );
      const stockVariation =
        template.baseStock - storeIndex * 2 + templateIndex;
      const priceVariation = template.basePrice * (1 + storeIndex * 0.03);

      return {
        id: `PRD-${store.id}${template.suffix}` as ProductId,
        storeId: store.id as any,
        storeName: store.name,
        name: template.name,
        category: template.category,
        stockQuantity: Math.max(6, Math.round(stockVariation)),
        price: Number(priceVariation.toFixed(2)) as Price,
        createdAt: created.toISOString() as ISODateTime,
        updatedAt: updated.toISOString() as ISODateTime,
      };
    });

    acc[store.id] = products;
    return acc;
  }, {} as Record<string, ProductWithStoreName[]>);

// Mock products data for a store
const getStoreProductsData = async (
  storeId: string,
  params: TableRequestParams
): Promise<TableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const storeProducts = storeProductsById[storeId] ?? [];

  // Filter by storeId
  let filtered = [...storeProducts];

  // Apply search
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.id.toLowerCase().includes(searchLower)
    );
  }

  // Apply filters
  if (params.filters) {
    try {
      const filters = JSON.parse(params.filters);
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
          const aVal: any = (a as any)[sort.id];
          const bVal: any = (b as any)[sort.id];
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

export const StoreDetails = () => {
  const { id } = useParams<{ id: string }>();
  const storeId = id || "1";
  const tableRef = useRef<BusinessTableHandle | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithStoreName | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);

  // Mock store stats - in real app, calculate from products
  const totalProducts = 142;
  const totalValue = 45230;
  const lowStockItems = 8;
  const createdDate = "Jan 15, 2024";

  const handleEditStore = () => {
    console.log("Edit store");
    // TODO: Navigate to edit store page or open modal
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

  const handleSaveProduct = (updatedProduct: ProductWithStoreName) => {
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

  const storeOptions = storeCatalog.map((store) => ({
    id: store.id,
    name: store.name,
  }));

  const categoryOptions = storeProductsSchema.products.category
    .values as string[];

  // Create getData function that includes storeId
  const getData = async (
    params: TableRequestParams
  ): Promise<TableResponse> => {
    return getStoreProductsData(storeId, params);
  };

  return (
    <PageLayout
      title='Store Details'
      headerIcon={<StoreIcon />}
      headerActions={
        <StoreDetailsHeaderActions onAddProduct={handleAddProduct} />
      }
    >
      <StoreInfoCard>
        <StoreInfoHeader>
          <StoreInfoMain>
            <StoreIconComponent />
            <StoreInfoDetails>
              <StoreName>Main Store</StoreName>
              <StoreId>ST-001</StoreId>
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
            value={totalProducts}
            iconColor='primary'
          />
          <StoreStat
            icon={<AttachMoneyIcon />}
            label='Total Value'
            value={`$${totalValue.toLocaleString()}`}
            iconColor='success'
          />
          <StoreStat
            icon={<WarningIcon />}
            label='Low Stock Items'
            value={lowStockItems}
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
