import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../service";
import { queryKeys } from "@/shared/config/queryKeys";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import type { Product } from "@/core/models/product/model";
import { getPreviousProductQueries } from "../utils/getPreviousProductQueries";
import { updateAllProductQueries } from "../utils/updateAllProductQueries";
import { allProductsUpdaterForDelete } from "../utils/allProductsUpdaterForDelete";
import { removeProductDetailQuery } from "../utils/removeProductDetailQuery";
import { restoreProductDetailQuery } from "../utils/restoreProductDetailQuery";
import { restorePreviousProductQueries } from "../utils/restorePreviousProductQueries";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });

      const previous = getPreviousProductQueries(queryClient);
      const previousDetail = queryClient.getQueryData<Product>(
        queryKeys.products.detail(deletedId)
      );

      updateAllProductQueries(
        queryClient,
        allProductsUpdaterForDelete(deletedId)
      );

      removeProductDetailQuery(queryClient, deletedId);

      return { previous, previousDetail };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.activities(),
      });
      showSuccessToast("Product deleted successfully");
    },
    onError: (error: Error, variables, context) => {
      if (context?.previous) {
        restorePreviousProductQueries(queryClient, context.previous);
      }
      if (context?.previousDetail) {
        restoreProductDetailQuery(
          queryClient,
          variables,
          context.previousDetail
        );
      }
      showErrorToast(error.message || "Failed to delete product");
    },
  });
}
