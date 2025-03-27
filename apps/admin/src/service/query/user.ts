'use client';

import { useQuery } from '@tanstack/react-query';

import { FindUserNotificationsCountDto } from '@zpanel/core';
import * as api from '../api';
import { ApiQueryOptions } from './type';

// ----- USER: NOTIFICATION COUNT -----

export function useUserNotificationCount(
  id: string,
  payload: FindUserNotificationsCountDto = {},
  options: ApiQueryOptions<'getUserNotificationCount'> = {},
) {
  const result = useQuery({
    ...options,
    queryKey: [api.getUserNotificationCount.getPath(id), payload],
    queryFn: () => api.getUserNotificationCount(id, payload),
  });

  return [result.data, result] as const;
}

export function useLatestUserNotification(
  id: string,
  options: ApiQueryOptions<'getLatestUserNotifications'> = {},
) {
  const result = useQuery({
    ...options,
    queryKey: [api.getLatestUserNotifications.getPath(id)],
    queryFn: () => api.getLatestUserNotifications(id),
  });

  return [result.data, result] as const;
}
