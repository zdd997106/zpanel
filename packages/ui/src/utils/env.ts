// ----- UTILS -----

import { get, has } from 'lodash';

export const env = {
  /**
   * Get an environment variable or throw an error if it's not set.
   */
  getOrThrow(envKey: EnvKey) {
    if (!has(config, envKey)) {
      throw new Error(
        [
          `Environment variable "${envKey}" is required but not set.`,
          'Please set it in the root ".env" file then restart the server.',
          'Or, check if the variable is correctly set in the "next.config.js" file.',
        ].join(' '),
      );
    }
    return config[envKey] as string;
  },

  /**
   * Get an environment variable or return null if it's not set.
   */
  get(envKey: EnvKey): string | null {
    return get(config, envKey, '');
  },
};

// ----- CONFIG -----

const config = {
  ...process.env,

  // --- FRONT END ENVIRONMENT VARIABLES ---
  API_BASE_URL: process.env.API_BASE_URL || process.env.CLIENT_API_BASE_URL || '',
};

// ----- TYPES -----

type EnvKey = keyof typeof config | (string & {});
