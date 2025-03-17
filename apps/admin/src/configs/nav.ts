import { EPermission } from '@zpanel/core';
import Icons from 'src/icons';

// ----------

export const navConfig: NavConfig = {
  groups: [
    {
      title: 'Overview',
      items: [
        {
          segment: 'overview',
          title: 'App',
          icon: 'Dashboard',
          permission: EPermission.APP_OVERVIEW,
        },
      ],
    },

    {
      title: 'Projects',
      items: [
        {
          icon: 'Portfolio',
          segment: 'projects/portfolio',
          title: 'Zdd Portfolio',
          permission: EPermission.PROJECT_PORTFOLIO,
        },
      ],
    },

    {
      title: 'General',
      items: [
        {
          icon: 'Feedback',
          segment: 'feedback',
          title: 'Feedback',
          description: 'Review and report to us',
          permission: EPermission.FEEDBACK,
        },
      ],
    },

    {
      title: 'Administration',
      items: [
        {
          segment: 'administration/user',
          title: 'User Manage',
          icon: 'Users',
          description: 'Manage users and their access',
          children: [
            {
              segment: '',
              title: 'User',
              exact: true,
              permission: EPermission.USER_CONFIGURE,
            },
            {
              segment: 'application',
              title: 'Application',
              permission: EPermission.APPLICATION_CONFIGURE,
            },
          ],
        },
        {
          segment: 'administration',
          title: 'Configuration',
          icon: 'Security',
          description: 'Manage permissions',
          children: [
            {
              segment: 'permission',
              title: 'Permission Management',
              permission: EPermission.PERMISSION_CONFIGURE,
            },
            {
              segment: 'role',
              title: 'Role Management',
              permission: EPermission.ROLE_CONFIGURE,
            },
            {
              segment: 'app-key',
              title: 'Outsource Access',
              icon: 'Key',
              permission: EPermission.APP_KEY_CONFIGURE,
            },
          ],
        },
      ],
    },
  ],
};

// ----- TYPES -----

export interface NavConfig {
  groups: NavGroupConfig[];
}

export interface NavGroupConfig {
  title: string;
  items: NavItemConfig[];
}

export interface NavItemConfig {
  segment: string;
  title: string;
  icon?: keyof typeof Icons;
  description?: string;
  exact?: boolean;
  permission?: EPermission;
  children?: NavItemConfig[];
}
