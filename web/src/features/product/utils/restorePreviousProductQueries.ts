import { QueryClient } from "@tanstack/react-query";
import { ProductQueryUpdaterMap } from "../types";

export function restorePreviousProductQueries(
  queryClient: QueryClient,
  previous: ProductQueryUpdaterMap
) {
  previous.forEach((data, keyStr) => {
    const queryKey = JSON.parse(keyStr);
    queryClient.setQueryData(queryKey, data);
  });
}
