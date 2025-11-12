import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "../service";
import { queryKeys } from "@/shared/config/queryKeys";

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) => storeService.createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
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
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storeService.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
    },
  });
}
