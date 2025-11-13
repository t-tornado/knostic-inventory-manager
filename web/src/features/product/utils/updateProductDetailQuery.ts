import { QueryClient } from "@tanstack/react-query";
import type { Product } from "@/core/models/product/model";
import { queryKeys } from "@/shared/config/queryKeys";

export function updateProductDetailQuery(
  queryClient: QueryClient,
  product: Product
) {
  queryClient.setQueryData(queryKeys.products.detail(product.id), product);
}
