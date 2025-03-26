'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from 'src/guards';

import * as api from '../api';
import { ApiQueryOptions } from './type';

// ----- USER: NOTIFICATION COUNT -----

export function useUserNotificationCount(
  options: ApiQueryOptions<'getUserNotificationCount'> = {},
) {
  const auth = useAuth();

  const result = useQuery({
    ...options,
    queryKey: [api.getUserNotificationCount.getPath(auth.id)],
    queryFn: () => api.getUserNotificationCount(auth.id),
  });

  return [result.data, result] as const;
}
