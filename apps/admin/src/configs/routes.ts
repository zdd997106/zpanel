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
} as const;

// ----- TYPES -----

export type RoutesConfig = typeof routesConfig;
