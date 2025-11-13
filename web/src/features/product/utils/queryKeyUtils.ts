import { QueryKey } from "@tanstack/react-query";

export const isProductsListQueryKey = (key: QueryKey) => {
  return Array.isArray(key) && key[0] === "products" && key[1] === "list";
};

export const isTableQueryKey = (key: QueryKey) => {
  return (
    Array.isArray(key) &&
    (key[0] === "table" || key[0] === "products") &&
    typeof key[1] === "object" &&
    key[1] !== null
  );
};
