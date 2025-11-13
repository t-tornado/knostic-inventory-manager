import type { Store } from "@/core/models/store/model";
import { StoreMetaModalFormState } from "./types";

export const createInitialState = (
  store: Store | null
): StoreMetaModalFormState => {
  return {
    name: store?.name ?? "",
  };
};
