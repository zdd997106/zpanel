import { ZodIssue } from 'zod';

export interface Response<T> {
  data: T;
  statusCode: number;
  timestamp: Date;
  path: string;
}

export interface ErrorResponse extends Response<undefined> {
  error?: ZodIssue[] | Error | Record<string, unknown>;
  message: string;
}
