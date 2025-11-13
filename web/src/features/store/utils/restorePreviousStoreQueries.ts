import { QueryClient } from "@tanstack/react-query";
import { StoreQueryUpdaterMap } from "../types";

export function restorePreviousStoreQueries(
  queryClient: QueryClient,
  previous: StoreQueryUpdaterMap
) {
  previous.forEach((data, keyStr) => {
    const queryKey = JSON.parse(keyStr);
    queryClient.setQueryData(queryKey, data);
  });
}
