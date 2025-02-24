import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Api } from '@zpanel/core';

// ----------

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Api.Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Api.Response<T>> {
    const request: Request = context.switchToHttp().getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => ({
        statusCode: 200,
        data: (data ?? null) as never,
        path,
        timestamp: new Date().toISOString() as never as Date,
      })),
    );
  }
}
