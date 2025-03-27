import { RawCreateParams } from 'zod';

import {
  EAppKeyStatus,
  EApplicationStatus,
  ENotificationAudience,
  ENotificationStatus,
  ENotificationType,
  EPermissionStatus,
  ERoleStatus,
} from 'src/enum';

import { oneOf, withNumberPreprocess } from './helpers';

// ----- PERMISSION STATUS -----

export function permissionStatus(params?: RawCreateParams) {
  return withNumberPreprocess(
    oneOf([EPermissionStatus.ENABLED, EPermissionStatus.DISABLED], params),
  );
}

export function roleStatus(params?: RawCreateParams) {
  return withNumberPreprocess(oneOf([ERoleStatus.ENABLED, ERoleStatus.DISABLED], params));
}

export function applicationStatus(params?: RawCreateParams) {
  return withNumberPreprocess(
    oneOf(
      [
        EApplicationStatus.APPROVED,
        EApplicationStatus.REAPPLIED,
        EApplicationStatus.REJECTED,
        EApplicationStatus.UNREVIEWED,
      ],
      params,
    ),
  );
}

export function appKeyStatus(params?: RawCreateParams) {
  return withNumberPreprocess(oneOf([EAppKeyStatus.ENABLED, EAppKeyStatus.DISABLED], params));
}

export function notificationStatus(params?: RawCreateParams) {
  return withNumberPreprocess(
    oneOf(
      [
        ENotificationStatus.SEND,
        ENotificationStatus.RECEIVED,
        ENotificationStatus.READ,
        ENotificationStatus.DELETED,
      ],
      params,
    ),
  );
}

export function notificationType(params?: RawCreateParams) {
  return withNumberPreprocess(
    oneOf(
      [
        ENotificationType.SYSTEM,
        ENotificationType.SECURITY_ALERT,
        ENotificationType.GENERAL,
        ENotificationType.TASK,
        ENotificationType.ANNOUNCEMENT,
      ],
      params,
    ),
  );
}

export function notificationAudience(params?: RawCreateParams) {
  return oneOf(
    [
      ENotificationAudience.ALL,
      ENotificationAudience.ADMIN,
      ENotificationAudience.ROLE,
      ENotificationAudience.USER,
    ],
    params,
  );
}
