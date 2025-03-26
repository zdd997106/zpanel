export const routesConfig = {
  // --- AUTH ---

  signIn: '/sign-in',
  signUp: '/sign-up',

  // --- DASHBOARD ---

  dashboard: '/overview',

  // --- ACCOUNT ---

  account: '/account',

  // --- NOTIFICATIONS ---

  notifications: '/notifications',

  // --- SETTINGS ---

  settings: '/settings',
  userApiKey: '/settings/app-key',

  // --- ADMINISTRATION ---

  userManagement: '/administration/user',
  applicationManagement: '/administration/user/application',
  roleManagement: '/administration/role',
  permissionManagement: '/administration/permission',
} as const;

// ----- TYPES -----

export type RoutesConfig = typeof routesConfig;
