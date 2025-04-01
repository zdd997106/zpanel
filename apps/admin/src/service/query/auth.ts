'use client';

import { useQuery } from '@tanstack/react-query';
import { useFallback } from '@zpanel/ui/hooks';

import * as api from '../api';

// ----- AUTH: USER -----

export function useAuthUser(enabled = false) {
  const authUserResult = useQuery({
    queryFn: () => api.getAuthUser(),
    queryKey: [api.getAuthUser.getPath()],
    enabled,
  });

  return [authUserResult.data, authUserResult] as const;
}

// ----- AUTH: PERMISSION KEYS -----

export function usePermissionKeys(enabled = true) {
  const permissionKeysResult = useQuery({
    queryFn: () => api.getPermissionKeys(),
    queryKey: [api.getPermissionKeys.getPath()],
    enabled,
  });

  const permissionKeys = useFallback(
    permissionKeysResult.data,
    api.getPermissionKeys.getPath(),
    [],
  );

  return [permissionKeys, permissionKeysResult] as const;
}
