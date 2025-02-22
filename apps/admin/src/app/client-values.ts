'use client';

import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// ----------

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (_failureCount, error) => {
        // stop retrying if the error response is in valid service-defined format
        if (error instanceof AxiosError && error.response?.data?.statusCode < 500) return false;

        // otherwise, retry until the failure-count reach to the limit
        if (error instanceof AxiosError) return true;

        // never retry if the error is not a internet issue
        return false;
      },
    },
  },
});
