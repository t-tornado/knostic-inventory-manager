import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error && typeof error === "object" && "response" in error) {
          const status = (error as { response?: { status?: number } }).response
            ?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 30000,
      gcTime: 300000,
    },
    mutations: {
      retry: false,
    },
  },
});

export const QueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
};
