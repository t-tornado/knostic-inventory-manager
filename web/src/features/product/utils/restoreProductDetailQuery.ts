import { QueryClient } from "@tanstack/react-query";
import type { Product } from "@/core/models/product/model";
import { queryKeys } from "@/shared/config/queryKeys";

export function restoreProductDetailQuery(
  queryClient: QueryClient,
  productId: string,
  previousDetail: Product | undefined
) {
  if (previousDetail) {
    queryClient.setQueryData(
      queryKeys.products.detail(productId),
      previousDetail
    );
  }
}
