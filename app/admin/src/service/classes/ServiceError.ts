import { get, isString, pick } from 'lodash';
import { UseFormReturn } from 'react-hook-form';

import { ServiceResult } from '../types';

// ----------

export default class ServiceError extends Error {
  public statusCode: number;

  public error: unknown;

  constructor(serviceResponseData: Omit<ServiceResult<null>, 'data'>) {
    super(serviceResponseData.message);
    this.statusCode = serviceResponseData.statusCode;
    this.error = serviceResponseData.error;
  }

  public hasFieldErrors = () => Array.isArray(this.error) && this.error.length > 0;

  public emitFieldErrors = (methods: UseFormReturn<any>) => emitFieldErrors(methods, this);
}

// ----- INTERNAL HELPERS -----

function emitFieldErrors(methods: UseFormReturn<any>, serviceError: ServiceError) {
  if (!serviceError.hasFieldErrors()) return;

  const fieldErrors: FieldError[] = [];

  Array(serviceError.error).forEach((fieldError) => {
    if (isFieldError(fieldError)) fieldErrors.push(pick(fieldError, ['path', 'message']));
  }, []);

  fieldErrors.forEach((item) => {
    methods.setError(item.path as never, { type: 'manual', message: item.message });
  });

  return true;
}

interface FieldError {
  path: string;
  message: string;
}

// ----- INTERNAL HELPERS -----

function isFieldError(value: unknown): value is FieldError {
  return isString(get(value, 'path')) && isString(get(value, 'message'));
}
