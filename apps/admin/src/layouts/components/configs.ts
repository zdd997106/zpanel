import { EPermission } from '@zpanel/core';

import CONFIGS from 'src/configs';

export const profileDrawerConfig = {
  width: 320,

  avatarSize: 120,

  paddingX: 2.5,

  shortcuts: [
    {
      icon: 'Settings',
      title: 'Account Settings',
      href: CONFIGS.routes.account,
      permission: EPermission.ACCOUNT,
    },
  ],
};
