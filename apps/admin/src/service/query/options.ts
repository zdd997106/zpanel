'use client';

import { useQuery } from '@tanstack/react-query';
import { useFallback } from '@zpanel/ui/hooks';

import * as api from '../api';
import { ApiQueryOptions } from './type';

// ----- OPTIONS: ROLE -----

export function useRoleOptions(options: ApiQueryOptions<'getRoleOptions'> = {}) {
  const roleOptionsResult = useQuery({
    ...options,
    queryFn: () => api.getRoleOptions(),
    queryKey: [api.getRoleOptions.getPath()],
  });

  const roleOptions = useFallback(roleOptionsResult.data, api.getRoleOptions.getPath(), []);

  return [roleOptions, roleOptionsResult] as const;
}

// ----- OPTIONS: USER -----

export function useUserOptions(options: ApiQueryOptions<'getUserOptions'> = {}) {
  const result = useQuery({
    ...options,
    queryFn: () => api.getUserOptions(),
    queryKey: [api.getUserOptions.getPath()],
  });

  const userOptions = useFallback(result.data, api.getUserOptions.getPath(), []);

  return [userOptions, result] as const;
}
