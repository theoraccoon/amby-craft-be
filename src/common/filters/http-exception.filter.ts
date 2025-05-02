import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dtos/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'An unexpected error occurred';
    let errors: any[] = [];

    if (exception instanceof HttpException) {
      const rawResponse: unknown = exception.getResponse();

      if (typeof rawResponse === 'string') {
        message = rawResponse;
      } else if (typeof rawResponse === 'object' && rawResponse !== null) {
        const resObj = rawResponse as { message?: string; errors?: any[] };
        message = resObj.message ?? message;
        if (Array.isArray(resObj.errors)) {
          errors = resObj.errors;
        }
      }
    }

    res.status(status).json(ApiResponse.error(message, errors));
  }
}
