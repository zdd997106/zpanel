import CONFIGS from 'src/configs';

export const profileDrawerConfig = {
  width: 320,

  avatarSize: 96,

  paddingX: 2.5,

  shortcuts: [
    {
      icon: 'Profile',
      title: 'Profile',
      href: CONFIGS.routes.account,
    },
    {
      icon: 'Settings',
      title: 'Account Settings',
      href: CONFIGS.routes.settings,
    },
  ],
};
