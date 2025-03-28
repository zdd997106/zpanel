import { ENotificationAudience, ENotificationType } from '@zpanel/core';

export const notificationAudience = new Map([
  [ENotificationAudience.ALL, 'All'],
  [ENotificationAudience.ADMIN, 'Administrators'],
  [ENotificationAudience.ROLE, 'Specific Roles'],
  [ENotificationAudience.USER, 'Specific Users'],
]);

export const notificationType = new Map([
  [ENotificationType.SYSTEM, 'System'],
  [ENotificationType.SECURITY_ALERT, 'Security Alert'],
  [ENotificationType.GENERAL, 'General'],
  [ENotificationType.TASK, 'Task'],
  [ENotificationType.ANNOUNCEMENT, 'Announcement'],
]);
