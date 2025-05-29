import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = createId();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url, body, query, ip } = request;
    const startTime = Date.now();

    // Log request start
    console.log({
      type: 'REQUEST_START',
      requestId,
      timestamp: new Date().toISOString(),
      method,
      url,
      body: this.sanitizeBody(body),
      query,
      clientIp: ip,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const executionTime = endTime - startTime;

          // Log request end
          console.log({
            type: 'REQUEST_END',
            requestId,
            timestamp: new Date().toISOString(),
            method,
            url,
            executionTime: `${executionTime}ms`,
            statusCode: 200,
          });
        },
        error: (error) => {
          const endTime = Date.now();
          const executionTime = endTime - startTime;

          // Log request error
          console.log({
            type: 'REQUEST_ERROR',
            requestId,
            timestamp: new Date().toISOString(),
            method,
            url,
            executionTime: `${executionTime}ms`,
            error: {
              name: error.name,
              message: error.message,
              statusCode: error.status || 500,
            },
            errorMessage: error.response.message,
          });
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    if (sanitized.password) {
      sanitized.password = '[REDACTED]';
    }
    return sanitized;
  }
}
