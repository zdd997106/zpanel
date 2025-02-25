import { SHA256 } from 'crypto-js';

export function encodePassword(password: string, userId: number) {
  return SHA256(
    [password, process.env.PASSWORD_SECRET_KEY, userId].join(':'),
  ).toString();
}
