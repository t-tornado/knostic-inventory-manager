import type { Store } from "@/core/models/store/model";
import { StoreQueryResult, StoreQueryUpdater } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allStoresUpdaterWithServerResponseForCreate = (
  createdStore: Store
) => {
  return (old: StoreQueryUpdater) => {
    if (!old) return old;

    const data = old.data as Store[];
    const updatedData = data.map((store) =>
      String(store.id).startsWith("temp-") ? createdStore : store
    );

    if (!updatedData.some((store) => store.id === createdStore.id)) {
      updatedData.unshift(createdStore);
    }

    if ("meta" in old) {
      return {
        ...old,
        data: updatedData,
      } as TableResponse;
    } else {
      return {
        ...old,
        data: updatedData,
      } as StoreQueryResult;
    }
  };
};
