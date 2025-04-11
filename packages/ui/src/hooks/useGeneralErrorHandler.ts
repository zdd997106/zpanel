'use client';

import { useDialogs } from 'gexii/dialogs';
import { useCallback } from 'react';
import { ServiceError } from '../service';

export function useGeneralErrorHandler() {
  const dialogs = useDialogs();

  return useCallback(
    (error: unknown) => {
      // Check if the error is valid error
      if (!(error instanceof Error)) return;

      if (!(error instanceof ServiceError)) {
        dialogs.alert('Error', error.message || 'Something went wrong, please try again later');
        return;
      }

      // [NOTE] Unauthorized errors are handled by the AuthGuard,
      if (error.isUnauthorized()) return;

      if (error.isForbidden()) {
        dialogs.alert('Error', 'You do not have permission to perform this action');
        return;
      }

      dialogs.alert('Error', 'Something went wrong, please try again later');
    },
    [dialogs],
  );
}
