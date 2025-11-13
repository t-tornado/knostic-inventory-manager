import type { Store } from "@/core/models/store/model";
import { StoreQueryResult, StoreQueryUpdater } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allStoresUpdaterWithServerResponse = (updatedStore: Store) => {
  return (old: StoreQueryUpdater) => {
    if (!old) return old;

    const data = old.data as Store[];
    const updatedData = data.map((store) =>
      store.id === updatedStore.id ? updatedStore : store
    );

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
