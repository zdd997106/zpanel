'use client';

import { useSnackbar as useNotistack } from 'notistack';
import { useMemo } from 'react';

// ----------

export function useSnackbar() {
  const snackbar = useNotistack();

  return useMemo(() => {
    function enqueueSnackbar(message: string, options?: any) {
      snackbar.enqueueSnackbar(message, options);
    }

    enqueueSnackbar.success = (message: string, options?: any) =>
      enqueueSnackbar(message, { ...options, variant: 'success' });

    enqueueSnackbar.error = (message: string, options?: any) =>
      enqueueSnackbar(message, { ...options, variant: 'error' });

    enqueueSnackbar.warning = (message: string, options?: any) =>
      enqueueSnackbar(message, { ...options, variant: 'warning' });

    enqueueSnackbar.info = (message: string, options?: any) =>
      enqueueSnackbar(message, { ...options, variant: 'info' });

    enqueueSnackbar.close = (key: string) => snackbar.closeSnackbar(key);

    return enqueueSnackbar;
  }, []);
}
