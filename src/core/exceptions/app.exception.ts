import type { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

import type { ErrorCode } from '@/shared';

export class AppException extends HttpException {
  constructor(errorCode: ErrorCode, statusCode: HttpStatus, message: string | string[]) {
    super(
      {
        errorCode,
        statusCode,
        message,
      },
      statusCode,
    );
  }
}
