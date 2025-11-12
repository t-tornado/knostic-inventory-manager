/**
 * Product category options
 * Shared across features that need product category selection
 */
export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Accessories",
  "Cables",
  "Hardware",
  "Software",
  "Other",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
