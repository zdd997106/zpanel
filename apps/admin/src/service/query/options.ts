'use client';

import { useQuery } from '@tanstack/react-query';

import { useFallback } from 'src/hooks';

import * as api from '../api';

// ----- OPTIONS: ROLE -----

export function useRoleOptions() {
  const roleOptionsResult = useQuery({
    queryFn: () => api.getRoleOptions(),
    queryKey: [api.getRoleOptions.getPath()],
  });

  const roleOptions = useFallback(roleOptionsResult.data, api.getRoleOptions.getPath(), []);

  return [roleOptions, roleOptionsResult] as const;
}
