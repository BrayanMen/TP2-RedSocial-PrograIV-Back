import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../interface/api-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const res = context.switchToHttp().getResponse<Response>();
    const req = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data: T) => ({
        data,
        statusCode: res.statusCode ?? HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method,
        success: true,
      })),
    );
  }
}
