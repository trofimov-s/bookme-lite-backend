import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';

import { AppException, type ErrorResponseDto } from '../exceptions';
import { HTTP_STATUS_TO_ERROR_CODE } from './http-status-to-error-code.map';

import { ErrorCode } from '@/shared';

function getErrorCodeByStatus(statusCode: HttpStatus): ErrorCode {
  return HTTP_STATUS_TO_ERROR_CODE[statusCode] ?? ErrorCode.HTTP_ERROR;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof AppException) {
      const { statusCode, message, errorCode } = exception.getResponse() as ErrorResponseDto;

      response.status(statusCode).json({ statusCode, message, errorCode });
      return;
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const body = exception.getResponse() as string | { message: string | string[] };
      const message: string | string[] = typeof body === 'string' ? body : body.message;
      const errorCode = getErrorCodeByStatus(statusCode);

      response.status(statusCode).json({ statusCode, message, errorCode });
      return;
    }

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(exception);
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    });
  }
}
