import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../service";
import { queryKeys } from "@/shared/config/queryKeys";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      storeId: string;
      name: string;
      category: string;
      stockQuantity: number;
      price: number;
    }) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      showSuccessToast("Product created successfully");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to create product");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        storeId?: string;
        name?: string;
        category?: string;
        stockQuantity?: number;
        price?: number;
      };
    }) => productService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.setQueryData(
        queryKeys.products.detail(updatedProduct.id),
        updatedProduct
      );
      showSuccessToast("Product updated successfully");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to update product");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      showSuccessToast("Product deleted successfully");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to delete product");
    },
  });
}
