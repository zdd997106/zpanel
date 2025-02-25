import { HttpException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

// ----------

export function createValidationError(path: string[], message: string) {
  return new HttpException('Validation Error', HttpStatus.BAD_REQUEST, {
    cause: new ZodError([{ code: 'custom', path, message }]),
  });
}
