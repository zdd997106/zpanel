// ----- UTILS -----

export const env = {
  /**
   * Get an environment variable or throw an error if it's not set.
   */
  getOrThrow(envKey: EnvKey) {
    if (!config[envKey]) {
      throw new Error(
        [
          `Environment variable "${envKey}" is required but not set.`,
          'Please set it in the root ".env" file then restart the server.',
          'Or, check if the variable is correctly set in the "next.config.js" file.',
        ].join(' '),
      );
    }
    return config[envKey];
  },

  /**
   * Get an environment variable or return null if it's not set.
   */
  get(envKey: EnvKey): string | null {
    return config[envKey] || null;
  },
};

// ----- CONFIG -----

const config = {
  API_BASE_URL: process.env.API_BASE_URL || process.env.CLIENT_API_BASE_URL || '',
};

// ----- TYPES -----

type EnvKey = keyof typeof config;
