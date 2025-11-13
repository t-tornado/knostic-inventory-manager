import type { Store } from "@/core/models/store/model";
import { StoreQueryResult, StoreQueryUpdater } from "../types";
import { TableResponse } from "@/shared/components/BusinessTable";

export const allStoresUpdaterForDelete = (deletedId: string) => {
  return (old: StoreQueryUpdater) => {
    if (!old) return old;

    const filtered = old.data.filter(
      (store: unknown) => (store as Store).id !== deletedId
    );

    if ("meta" in old) {
      return {
        ...old,
        data: filtered,
        meta: {
          ...old.meta,
          total: Math.max(0, (old.meta?.total ?? old.data.length) - 1),
        },
      } as TableResponse;
    } else {
      return {
        ...old,
        data: filtered,
        total: Math.max(0, (old.total ?? old.data.length) - 1),
      } as StoreQueryResult;
    }
  };
};
