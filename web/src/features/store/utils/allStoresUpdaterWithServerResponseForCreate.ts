import type { Store } from "@/core/models/store/model";
import { StoreQueryResult, StoreQueryUpdater } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allStoresUpdaterWithServerResponseForCreate = (
  createdStore: Store
) => {
  return (old: StoreQueryUpdater) => {
    if (!old) return old;

    const updatedData = old.data.map((s: Store) =>
      String(s.id).startsWith("temp-") ? createdStore : s
    );

    if (!updatedData.some((s: Store) => s.id === createdStore.id)) {
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
