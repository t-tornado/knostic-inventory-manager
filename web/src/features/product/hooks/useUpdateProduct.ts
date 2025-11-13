import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../service";
import { queryKeys } from "@/shared/config/queryKeys";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import type { Product } from "@/core/models/product/model";
import { getPreviousProductQueries } from "../utils/getPreviousProductQueries";
import { updateAllProductQueries } from "../utils/updateAllProductQueries";
import { allProductsUpdater } from "../utils/allProductsUpdater";
import { allProductsUpdaterWithServerResponse } from "../utils/allProductsUpdaterWithServerResponse";
import { updateProductDetailQuery } from "../utils/updateProductDetailQuery";
import { restoreProductDetailQuery } from "../utils/restoreProductDetailQuery";
import { restorePreviousProductQueries } from "../utils/restorePreviousProductQueries";
import { nowISO } from "@/shared/utils/date";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.updateProduct(id, data),
    onMutate: async ({ id, data: updatePayload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });

      const previous = getPreviousProductQueries(queryClient);

      const previousDetail = queryClient.getQueryData<Product>(
        queryKeys.products.detail(id)
      );

      updateAllProductQueries(
        queryClient,
        allProductsUpdater(updatePayload, id)
      );

      if (previousDetail) {
        queryClient.setQueryData(queryKeys.products.detail(id), {
          ...previousDetail,
          ...updatePayload,
          updatedAt: nowISO(),
        });
      }
      return { previous, previousDetail };
    },
    onSuccess: (updatedProduct) => {
      updateAllProductQueries(
        queryClient,
        allProductsUpdaterWithServerResponse(updatedProduct)
      );

      updateProductDetailQuery(queryClient, updatedProduct);

      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.activities(),
      });
      showSuccessToast("Product updated successfully");
    },
    onError: (error: Error, variables, context) => {
      if (context?.previous) {
        restorePreviousProductQueries(queryClient, context.previous);
      }
      if (context?.previousDetail) {
        restoreProductDetailQuery(
          queryClient,
          variables.id,
          context.previousDetail
        );
      }
      showErrorToast(error.message || "Failed to update product");
    },
  });
}
