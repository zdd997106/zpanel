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
        },
        {
          icon: 'Monitor',
          segment: 'projects/domain-hub',
          title: 'Domain Hub',
          children: [
            {
              segment: 'domain',
              title: 'Domains',
            },
            {
              segment: 'certification',
              title: 'Certifications',
            },
            {
              segment: 'public-file',
              title: 'Public Files',
            },
          ],
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
            },
            {
              segment: 'application',
              title: 'Application',
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
            },
            {
              segment: 'role',
              title: 'Role Management',
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
  children?: NavItemConfig[];
}
