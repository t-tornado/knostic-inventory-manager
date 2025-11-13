import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "../service";
import { queryKeys } from "@/shared/config/queryKeys";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import type { StoreDetails } from "../types";
import type { Store } from "@/core/models/store/model";
import { getPreviousStoreQueries } from "../utils/getPreviousStoreQueries";
import { updateAllStoreQueries } from "../utils/updateAllStoreQueries";
import { allStoresUpdaterForDelete } from "../utils/allStoresUpdaterForDelete";
import { removeStoreDetailQueries } from "../utils/removeStoreDetailQueries";
import { restoreStoreDetailQuery } from "../utils/restoreStoreDetailQuery";
import { restoreStoreDetailWithStatsQuery } from "../utils/restoreStoreDetailWithStatsQuery";
import { restorePreviousStoreQueries } from "../utils/restorePreviousStoreQueries";

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storeService.deleteStore(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.stores.all });

      const previous = getPreviousStoreQueries(queryClient);
      const previousDetail = queryClient.getQueryData<Store>(
        queryKeys.stores.detail(deletedId)
      );
      const previousDetailWithStats = queryClient.getQueryData<StoreDetails>(
        queryKeys.stores.detailWithStats(deletedId)
      );

      updateAllStoreQueries(queryClient, allStoresUpdaterForDelete(deletedId));

      removeStoreDetailQueries(queryClient, deletedId);

      return { previous, previousDetail, previousDetailWithStats };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.activities(),
      });
      showSuccessToast("Store deleted successfully");
    },
    onError: (error: Error, variables, context) => {
      if (context?.previous) {
        restorePreviousStoreQueries(queryClient, context.previous);
      }
      if (context?.previousDetail) {
        restoreStoreDetailQuery(queryClient, variables, context.previousDetail);
      }
      if (context?.previousDetailWithStats) {
        restoreStoreDetailWithStatsQuery(
          queryClient,
          variables,
          context.previousDetailWithStats
        );
      }
      showErrorToast(error.message || "Failed to delete store");
    },
  });
}
