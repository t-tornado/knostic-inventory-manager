import { TableSchema } from "@/shared/components/BusinessTable";

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Accessories",
  "Cables",
  "Hardware",
  "Software",
  "Other",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCTS_SCHEMA: TableSchema = {
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
