import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Api } from '@zpanel/core';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

// ----------

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse: Api.ErrorResponse = {
      statusCode: status,
      message: exception.message,
      error: findError(exception),
      path: request.url,
      timestamp: new Date().toISOString() as never as Date,
      data: undefined,
    };
    response.status(status).json(errorResponse);
  }
}

// ----- RELATED FUNCTIONS -----

function findError(exception: HttpException) {
  const error = (exception as { error?: Error }).error ?? exception.cause;
  if (error instanceof ZodError) {
    return error.errors;
  }
}
