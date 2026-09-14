import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@/shared';

export const HTTP_STATUS_TO_ERROR_CODE: {
  [key in HttpStatus]?: ErrorCode;
} = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.BAD_REQUEST,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorCode.INTERNAL_SERVER_ERROR,
};
