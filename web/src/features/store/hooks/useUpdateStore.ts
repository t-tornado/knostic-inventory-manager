import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "../service";
import { queryKeys } from "@/shared/config/queryKeys";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import type { StoreDetails } from "../types";
import type { Store } from "@/core/models/store/model";
import { getPreviousStoreQueries } from "../utils/getPreviousStoreQueries";
import { updateAllStoreQueries } from "../utils/updateAllStoreQueries";
import { allStoresUpdater } from "../utils/allStoresUpdater";
import { allStoresUpdaterWithServerResponse } from "../utils/allStoresUpdaterWithServerResponse";
import { updateStoreDetailQuery } from "../utils/updateStoreDetailQuery";
import { updateStoreDetailWithStatsQuery } from "../utils/updateStoreDetailWithStatsQuery";
import { restoreStoreDetailQuery } from "../utils/restoreStoreDetailQuery";
import { restoreStoreDetailWithStatsQuery } from "../utils/restoreStoreDetailWithStatsQuery";
import { restorePreviousStoreQueries } from "../utils/restorePreviousStoreQueries";
import { nowISO } from "@/shared/utils/date";

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      storeService.updateStore(id, data),
    onMutate: async ({ id, data: updatePayload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.stores.all });

      const previous = getPreviousStoreQueries(queryClient);
      const previousDetail = queryClient.getQueryData<Store>(
        queryKeys.stores.detail(id)
      );
      const previousDetailWithStats = queryClient.getQueryData<StoreDetails>(
        queryKeys.stores.detailWithStats(id)
      );

      updateAllStoreQueries(queryClient, allStoresUpdater(updatePayload, id));

      if (previousDetail) {
        queryClient.setQueryData(queryKeys.stores.detail(id), {
          ...previousDetail,
          ...updatePayload,
          updatedAt: nowISO(),
        });
      }

      updateStoreDetailWithStatsQuery(queryClient, id, updatePayload);

      return { previous, previousDetail, previousDetailWithStats };
    },
    onSuccess: (updatedStore) => {
      updateAllStoreQueries(
        queryClient,
        allStoresUpdaterWithServerResponse(updatedStore)
      );

      updateStoreDetailQuery(queryClient, updatedStore);

      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.detailWithStats(updatedStore.id),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.stores.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.activities(),
      });
      showSuccessToast("Store updated successfully");
    },
    onError: (error: Error, variables, context) => {
      if (context?.previous) {
        restorePreviousStoreQueries(queryClient, context.previous);
      }
      if (context?.previousDetail) {
        restoreStoreDetailQuery(
          queryClient,
          variables.id,
          context.previousDetail
        );
      }
      if (context?.previousDetailWithStats) {
        restoreStoreDetailWithStatsQuery(
          queryClient,
          variables.id,
          context.previousDetailWithStats
        );
      }
      showErrorToast(error.message || "Failed to update store");
    },
  });
}
