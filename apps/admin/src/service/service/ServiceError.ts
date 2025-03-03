import { get } from 'lodash';
import { UseFormReturn } from 'react-hook-form';

import { Api } from '@zpanel/core';

// ----------

export default class ServiceError extends Error {
  public statusCode: number;

  public error: unknown;

  constructor(serviceResponseData: Omit<Api.ErrorResponse, 'data'>) {
    super(serviceResponseData.message);
    this.statusCode = serviceResponseData.statusCode;
    this.error = serviceResponseData.error;
  }

  public hasFieldErrors = () => Array.isArray(this.error) && this.error.length > 0;

  public emitFieldErrors = (methods: UseFormReturn<any>) => emitFieldErrors(methods, this);
}

// ----- HELPERS -----

function emitFieldErrors(methods: UseFormReturn<any>, serviceError: ServiceError) {
  if (!serviceError.hasFieldErrors()) return;
  if (!Array.isArray(serviceError.error)) return;

  const fieldErrors: FieldError[] = [];

  serviceError.error.forEach((fieldError) => {
    if (isFieldError(fieldError)) fieldErrors.push(fieldError);
  });

  fieldErrors.forEach((item) => {
    methods.setError(item.path.join('.'), { type: 'validate', message: item.message });
  });
}

interface FieldError {
  path: [string];
  message: string;
}

// ----- INTERNAL HELPERS -----

function isFieldError(value: unknown): value is FieldError {
  return !!get(value, 'path') && !!get(value, 'message');
}
