export const routesConfig = {
  // --- AUTH ---

  signIn: '/sign-in',
  signUp: '/sign-up',

  // --- DASHBOARD ---

  dashboard: '/overview',

  // --- ACCOUNT ---

  account: '/account',

  // --- SETTINGS ---

  settings: '/settings',

  // --- ADMINISTRATION ---

  userManagement: '/administration/user',
  applicationManagement: '/administration/user/application',
  roleManagement: '/administration/role',
  permissionManagement: '/administration/permission',
} as const;

// ----- TYPES -----

export type RoutesConfig = typeof routesConfig;
