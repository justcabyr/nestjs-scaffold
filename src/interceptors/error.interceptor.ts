import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorName = 'InternalServerError';

        if (error instanceof HttpException) {
          status = error.getStatus();
          const errorResponse = error.getResponse();
          message =
            typeof errorResponse === 'string'
              ? errorResponse
              : (errorResponse as any).message || error.message;
          errorName = error.name;
        } else if (error instanceof Error) {
          message = error.message;
          errorName = error.name;
        }

        const errorResponse: ErrorResponse = {
          statusCode: status,
          message,
          error: errorName,
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        response.status(status).json(errorResponse);

        return throwError(() => error);
      }),
    );
  }
}
