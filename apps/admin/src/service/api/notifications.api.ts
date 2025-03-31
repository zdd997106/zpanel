import { CreateNotificationsDto, DataType, FindAllNotificationsDto } from '@zpanel/core';

import Service, { takeData } from '@zpanel/ui/service';

// ----- CONTEXT -----

const ENDPOINT = `/notifications`;
const api = new Service();

// ----- GET: ALL NOTIFICATIONS -----

export const getNotifications = (payload: FindAllNotificationsDto) =>
  takeData<DataType.Paged<DataType.NotificationDto>>(api.get(getNotifications.getPath(), payload));
getNotifications.getPath = () => `${ENDPOINT}`;

// ----- GET: NOTIFICATION DETAIL -----

export const getNotificationDetail = (id: string) =>
  takeData<DataType.NotificationDetailDto>(api.get(getNotificationDetail.getPath(id)));
getNotificationDetail.getPath = (id: string) => `${ENDPOINT}/${id}`;

// ----- POST: BROADCAST NOTIFICATION ------

export const broadcastNotification = (payload: CreateNotificationsDto) =>
  takeData<void>(api.post(broadcastNotification.getPath(), payload));
broadcastNotification.getPath = () => `${ENDPOINT}`;
