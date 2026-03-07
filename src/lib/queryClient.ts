import {
    QueryClient,
    QueryCache,
    MutationCache,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

/**
 * Global React Query client configuration (AD-16).
 * Implements caching, retry logic, and error handling.
 */
export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error: unknown, query) => {
            // Show toast only for background refetch errors
            // Initial load errors show inline UI instead
            if (query.state.data !== undefined) {
                const message =
                    error instanceof Error ? error.message : 'Something went wrong';
                toast.error(message);
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error: unknown) => {
            // Mutations handle errors in their own onError callbacks
            // This is fallback for unhandled cases
            const message =
                error instanceof Error ? error.message : 'Operation failed';
            console.error('Unhandled mutation error:', message);
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 30_000, // 30 seconds default
            gcTime: 300_000, // 5 minutes garbage collection
            retry: (failureCount, error: unknown) => {
                // Do not retry on 401, 403, 404
                const status = (error as { status?: number })?.status;
                if ([401, 403, 404].includes(status ?? 0)) {
                    return false;
                }
                return failureCount < 2;
            },
            refetchOnWindowFocus: true, // Refetch when user returns to tab
            refetchOnReconnect: true, // Refetch when internet reconnects
        },
        mutations: {
            retry: false, // Never auto-retry mutations — user must explicitly retry
        },
    },
});
