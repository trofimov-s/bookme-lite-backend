import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorCode } from '@/shared';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error status code',
    example: HttpStatus.CONFLICT,
    type: 'number',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error code from the ErrorCode map',
    example: ErrorCode.BOOKING_SLOT_UNAVAILABLE,
    enum: ErrorCode,
    enumName: 'ErrorCode',
  })
  errorCode: ErrorCode;

  @ApiProperty({
    description: 'Error message',
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: { type: 'string' },
      },
    ],
    example: ['email must be an email'],
  })
  message: string | string[];
}
