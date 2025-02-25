/* eslint-disable import/no-extraneous-dependencies */

import type { NextConfig } from 'next';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

const nextConfig: NextConfig = {
  env: {
    API_BASE_URL: '/api',
    SECRET_PASSWORD_KEY: process.env.SECRET_PASSWORD_KEY,
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
  },

  rewrites: async () => [
    { source: '/api/:path*', destination: `${process.env.API_BASE_URL}/:path*` },
  ],
};

export default nextConfig;
