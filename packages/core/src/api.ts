import { ZodIssue } from 'zod';

export interface Response<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface ErrorResponse extends Response<undefined> {
  error?: ZodIssue[];
  message: string;
}
