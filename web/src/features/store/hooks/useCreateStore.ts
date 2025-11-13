import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "../service";
import { queryKeys } from "@/shared/config/queryKeys";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import { getPreviousStoreQueries } from "../utils/getPreviousStoreQueries";
import { updateAllStoreQueries } from "../utils/updateAllStoreQueries";
import { allStoresUpdaterForCreate } from "../utils/allStoresUpdaterForCreate";
import { allStoresUpdaterWithServerResponseForCreate } from "../utils/allStoresUpdaterWithServerResponseForCreate";
import { updateStoreDetailQuery } from "../utils/updateStoreDetailQuery";
import { restorePreviousStoreQueries } from "../utils/restorePreviousStoreQueries";

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) => storeService.createStore(data),
    onMutate: async (newStore) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.stores.all });

      const previous = getPreviousStoreQueries(queryClient);

      updateAllStoreQueries(queryClient, allStoresUpdaterForCreate(newStore));

      return { previous };
    },
    onSuccess: (createdStore) => {
      updateAllStoreQueries(
        queryClient,
        allStoresUpdaterWithServerResponseForCreate(createdStore)
      );

      updateStoreDetailQuery(queryClient, createdStore);

      queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.activities(),
      });
      showSuccessToast("Store created successfully");
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        restorePreviousStoreQueries(queryClient, context.previous);
      }
      showErrorToast(error.message || "Failed to create store");
    },
  });
}
