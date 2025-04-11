'use client';

import { useAction } from 'gexii/hooks';
import { useGeneralErrorHandler } from './useGeneralErrorHandler';

// ----------

export const useGeneralAction: typeof useAction = (callback, options) => {
  const handleError = useGeneralErrorHandler();

  return useAction(callback, {
    ...options,
    onError: options?.onError ?? handleError,
  });
};
