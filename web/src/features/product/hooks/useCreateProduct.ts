import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../service";
import { queryKeys } from "@/shared/config/queryKeys";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import type { RawProductType } from "../types";
import { getPreviousProductQueries } from "../utils/getPreviousProductQueries";
import { updateAllProductQueries } from "../utils/updateAllProductQueries";
import { allProductsUpdaterForCreate } from "../utils/allProductsUpdaterForCreate";
import { allProductsUpdaterWithServerResponseForCreate } from "../utils/allProductsUpdaterWithServerResponseForCreate";
import { updateProductDetailQuery } from "../utils/updateProductDetailQuery";
import { restorePreviousProductQueries } from "../utils/restorePreviousProductQueries";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RawProductType) => productService.createProduct(data),
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });

      const previous = getPreviousProductQueries(queryClient);

      updateAllProductQueries(
        queryClient,
        allProductsUpdaterForCreate(newProduct)
      );

      return { previous };
    },
    onSuccess: (createdProduct) => {
      updateAllProductQueries(
        queryClient,
        allProductsUpdaterWithServerResponseForCreate(createdProduct)
      );

      updateProductDetailQuery(queryClient, createdProduct);

      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.activities(),
      });
      showSuccessToast("Product created successfully");
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        restorePreviousProductQueries(queryClient, context.previous);
      }
      showErrorToast(error.message || "Failed to create product");
    },
  });
}
