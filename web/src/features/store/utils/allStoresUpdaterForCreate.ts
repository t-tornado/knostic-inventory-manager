import type { Store } from "@/core/models/store/model";
import { StoreQueryResult, StoreQueryUpdater } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";
import { nowISO } from "@/shared/utils/date";

export const allStoresUpdaterForCreate = (newStore: { name: string }) => {
  return (old: StoreQueryUpdater) => {
    if (!old) return old;

    const optimisticStore: Store = {
      id: `temp-${Date.now()}`,
      ...newStore,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };

    if ("meta" in old) {
      return {
        ...old,
        data: [optimisticStore, ...old.data],
        meta: {
          ...old.meta,
          total: (old.meta?.total ?? old.data.length) + 1,
        },
      } as TableResponse;
    } else {
      return {
        ...old,
        data: [optimisticStore, ...old.data],
        total: (old.total ?? old.data.length) + 1,
      } as StoreQueryResult;
    }
  };
};

