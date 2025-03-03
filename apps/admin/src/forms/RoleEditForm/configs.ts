import { EPermissionAction } from '@zpanel/core';

export const actionConfig = {
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
