import { RawCreateParams } from 'zod';

import { EAppKeyStatus, EApplicationStatus, EPermissionStatus, ERoleStatus } from 'src/enum';

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
  return oneOf(
    [
      EApplicationStatus.APPROVED,
      EApplicationStatus.REAPPLIED,
      EApplicationStatus.REJECTED,
      EApplicationStatus.UNREVIEWED,
    ],
    params,
  );
}

export function appKeyStatus(params?: RawCreateParams) {
  return withNumberPreprocess(oneOf([EAppKeyStatus.ENABLED, EAppKeyStatus.DISABLED], params));
}
