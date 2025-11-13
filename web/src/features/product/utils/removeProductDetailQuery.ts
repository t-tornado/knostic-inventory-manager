import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";

export function removeProductDetailQuery(
  queryClient: QueryClient,
  productId: string
) {
  queryClient.removeQueries({
    queryKey: queryKeys.products.detail(productId),
  });
}
