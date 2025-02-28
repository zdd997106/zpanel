import { EPermissionStatus, ERole } from 'src/enum';
import { RawCreateParams } from 'zod';

import { oneOf, withNumberPreprocess } from './helpers';

// ----- PERMISSION STATUS -----

export function permissionStatus(params?: RawCreateParams) {
  return withNumberPreprocess(
    oneOf([EPermissionStatus.ENABLED, EPermissionStatus.DISABLED], params),
  );
}

export function role(params?: RawCreateParams) {
  return oneOf([ERole.ADMIN, ERole.USER], params);
}
