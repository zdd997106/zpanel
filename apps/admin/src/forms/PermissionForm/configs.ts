import { EPermissionAction } from '@zpanel/core';
import { isNumber } from 'lodash';

export const tableConfig = {};

export const actionConfig = {
  value: {
    all: Object.values(EPermissionAction)
      .filter(isNumber)
      // eslint-disable-next-line no-bitwise
      .reduce((acc, action) => acc | action, 0),
  },

  options: [
    {
      label: 'View',
      action: EPermissionAction.READ,
    },
    {
      label: 'Add',
      action: EPermissionAction.CREATE,
    },
    {
      label: 'Edit',
      action: EPermissionAction.UPDATE,
    },
    {
      label: 'Delete',
      action: EPermissionAction.DELETE,
    },
  ],
};
