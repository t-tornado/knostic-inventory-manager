import { useParams } from "react-router-dom";
import { PageLayout } from "@/shared/components/PageLayout";
import StoreIcon from "@mui/icons-material/Store";
import { BusinessTable } from "@/shared/components/BusinessTable";
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
import type { Product, ProductId } from "@/core/models/product/model";
import type { ISODateTime, Price } from "@/core/models/ValueObjects";

// Extended product type for display
interface ProductWithStoreName extends Product {
  storeName?: string;
}

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

// Mock products data for a store
const getStoreProductsData = async (
  storeId: string,
  params: TableRequestParams
): Promise<TableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock products for the store
  const allProducts: ProductWithStoreName[] = [
    {
      id: "PRD-001" as ProductId,
      storeId: "1" as any,
      name: 'Laptop Pro 15"',
      category: "Electronics",
      stockQuantity: 23,
      price: 1299.99 as Price,
      createdAt: "2024-01-16T10:00:00Z" as ISODateTime,
      updatedAt: "2024-01-20T14:30:00Z" as ISODateTime,
    },
    {
      id: "PRD-002" as ProductId,
      storeId: "1" as any,
      name: "Wireless Mouse",
      category: "Accessories",
      stockQuantity: 45,
      price: 29.99 as Price,
      createdAt: "2024-01-17T09:00:00Z" as ISODateTime,
      updatedAt: "2024-01-21T11:20:00Z" as ISODateTime,
    },
    {
      id: "PRD-003" as ProductId,
      storeId: "1" as any,
      name: "USB-C Cable",
      category: "Cables",
      stockQuantity: 8,
      price: 12.99 as Price,
      createdAt: "2024-01-18T08:00:00Z" as ISODateTime,
      updatedAt: "2024-01-22T16:45:00Z" as ISODateTime,
    },
    {
      id: "PRD-004" as ProductId,
      storeId: "1" as any,
      name: "Gaming Keyboard",
      category: "Accessories",
      stockQuantity: 32,
      price: 89.99 as Price,
      createdAt: "2024-01-19T10:30:00Z" as ISODateTime,
      updatedAt: "2024-01-23T09:15:00Z" as ISODateTime,
    },
    {
      id: "PRD-005" as ProductId,
      storeId: "1" as any,
      name: 'Monitor 27" 4K',
      category: "Electronics",
      stockQuantity: 15,
      price: 449.99 as Price,
      createdAt: "2024-01-20T11:00:00Z" as ISODateTime,
      updatedAt: "2024-01-24T13:30:00Z" as ISODateTime,
    },
    {
      id: "PRD-006" as ProductId,
      storeId: "1" as any,
      name: "Webcam HD",
      category: "Accessories",
      stockQuantity: 28,
      price: 79.99 as Price,
      createdAt: "2024-01-21T12:00:00Z" as ISODateTime,
      updatedAt: "2024-01-25T10:00:00Z" as ISODateTime,
    },
    {
      id: "PRD-007" as ProductId,
      storeId: "1" as any,
      name: "SSD 1TB",
      category: "Hardware",
      stockQuantity: 52,
      price: 129.99 as Price,
      createdAt: "2024-01-22T13:00:00Z" as ISODateTime,
      updatedAt: "2024-01-26T15:20:00Z" as ISODateTime,
    },
    {
      id: "PRD-008" as ProductId,
      storeId: "1" as any,
      name: "RAM 16GB DDR4",
      category: "Hardware",
      stockQuantity: 67,
      price: 89.99 as Price,
      createdAt: "2024-01-23T14:00:00Z" as ISODateTime,
      updatedAt: "2024-01-27T11:45:00Z" as ISODateTime,
    },
  ];

  // Filter by storeId
  let filtered = allProducts.filter((p) => p.storeId === storeId);

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
    console.log("Row clicked:", row);
    // TODO: Navigate to product details
  };

  const handleFiltersChange = (filters: any[]) => {
    console.log("Filters changed:", filters);
  };

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
    </PageLayout>
  );
};
