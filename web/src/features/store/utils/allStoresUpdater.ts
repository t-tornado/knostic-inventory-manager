import type { Store } from "@/core/models/store/model";
import { StoreQueryResult, StoreQueryUpdater } from "../types";
import { nowISO } from "@/shared/utils/date";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allStoresUpdater = (
  updatePayload: { name: string },
  id: string
) => {
  return (old: StoreQueryUpdater) => {
    if (!old) return old;

    const updatedData = old.data.map((store: Store) =>
      store.id === id
        ? {
            ...store,
            ...updatePayload,
            updatedAt: nowISO(),
          }
        : store
    );

    if ("meta" in old) {
      return {
        ...old,
        data: updatedData,
      } as TableResponse;
    }
    return {
      ...old,
      data: updatedData,
    } as StoreQueryResult;
  };
};
