import { isNumber } from 'lodash';

import { EPermissionAction } from 'src/enum';

// ----- PERMISSION ACTION VALUE -----

/**
 * The value of all permission actions enabled.
 */
export const ALL_ACTIONS = Object.values(EPermissionAction)
  .filter(isNumber)
  .reduce((acc, value) => acc | value, 0);
