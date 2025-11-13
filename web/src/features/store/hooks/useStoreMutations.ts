import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "../service";
import { queryKeys } from "@/shared/config/queryKeys";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) => storeService.createStore(data),
    onSuccess: (createdStore) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
      queryClient.setQueryData(
        queryKeys.stores.detail(createdStore.id),
        createdStore
      );
      showSuccessToast("Store created successfully");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to create store");
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      storeService.updateStore(id, data),
    onSuccess: (updatedStore) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
      queryClient.setQueryData(
        queryKeys.stores.detail(updatedStore.id),
        updatedStore
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.detailWithStats(updatedStore.id),
      });
      showSuccessToast("Store updated successfully");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to update store");
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storeService.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
      showSuccessToast("Store deleted successfully");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Failed to delete store");
    },
  });
}
