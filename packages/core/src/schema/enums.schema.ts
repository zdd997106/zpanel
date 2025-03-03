import { RawCreateParams } from 'zod';

import { EPermissionStatus, ERole, ERoleStatus } from 'src/enum';

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

export function role(params?: RawCreateParams) {
  return oneOf([ERole.ADMIN, ERole.VIEWER, ERole.GUEST], params);
}
