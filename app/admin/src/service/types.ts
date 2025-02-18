export interface ServiceResult<T> {
  statusCode: number;
  error?: unknown;
  message?: string;
  timeStamp: Date;
  data: T;
}
