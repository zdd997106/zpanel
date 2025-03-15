import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: [
    '../../.env', // relative to the current working directory (run with pnpm scripts)
    path.resolve(__dirname, '../../../../.env'), // relative to the current file
  ],
});
