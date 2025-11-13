import type { Store } from "@/core/models/store/model";
import { StoreQueryResult, StoreQueryUpdater } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allStoresUpdaterWithServerResponse = (updatedStore: Store) => {
  return (old: StoreQueryUpdater) => {
    if (!old) return old;

    const updatedData = old.data.map((s: Store) =>
      s.id === updatedStore.id ? updatedStore : s
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
