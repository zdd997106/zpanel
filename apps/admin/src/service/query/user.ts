'use client';

import { useQuery } from '@tanstack/react-query';

import * as api from '../api';
import { ApiQueryOptions } from './type';

// ----- USER: NOTIFICATION COUNT -----

export function useUserNotificationCount(
  id: string,
  options: ApiQueryOptions<'getUserNotificationCount'> = {},
) {
  const result = useQuery({
    ...options,
    queryKey: [api.getUserNotificationCount.getPath(id)],
    queryFn: () => api.getUserNotificationCount(id),
  });

  return [result.data, result] as const;
}
