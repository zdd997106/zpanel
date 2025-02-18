import { EPermissionAction, EPermissionStatus, ERoleStatus, ERowsPerPage } from 'src/enum';
import { RawCreateParams } from 'zod';

import { oneOf, withNumberPreprocess } from './helpers';

// ----- PERMISSION STATUS -----

export function permissionStatus(params?: RawCreateParams) {
  return withNumberPreprocess(
    oneOf([EPermissionStatus.ENABLED, EPermissionStatus.DISABLED], params),
  );
}

// ----- PERMISSION ACTION -----

export function permissionAction(params?: RawCreateParams) {
  return withNumberPreprocess(
    oneOf(
      [
        EPermissionAction.CREATE,
        EPermissionAction.READ,
        EPermissionAction.UPDATE,
        EPermissionAction.DELETE,
      ],
      params,
    ),
  );
}

// ----- ROLE STATUS -----

export function roleStatus(params?: RawCreateParams) {
  return withNumberPreprocess(oneOf([ERoleStatus.ENABLED, ERoleStatus.DISABLED], params));
}

// ----- TABLE ROWS PER PAGE -----

export function tableRowsPerPage(params?: RawCreateParams) {
  return withNumberPreprocess(
    oneOf(
      [
        ERowsPerPage.VERY_FEW,
        ERowsPerPage.FEW,
        ERowsPerPage.NORMAL,
        ERowsPerPage.MANY,
        ERowsPerPage.VERY_MANY,
      ],
      params,
    ),
  );
}
