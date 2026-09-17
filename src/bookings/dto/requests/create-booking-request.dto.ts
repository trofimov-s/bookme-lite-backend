import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { AtLeastOneOfProperty } from '@/shared';

@AtLeastOneOfProperty(['clientEmail', 'clientPhone'])
export class CreateBookingRequestDto {
  @ApiProperty({
    example: 'johndoe',
    required: true,
    minLength: 3,
    type: 'string',
  })
  @MinLength(3)
  @IsString()
  slug: string;

  @ApiProperty({
    example: '2026-09-16T05:00:00.000Z',
    required: true,
    format: 'date-time',
  })
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/, {
    message: 'startAt must be a UTC ISO date-time rounded to a minute',
  })
  startAt: string;

  @ApiProperty({
    example: 'John Doe',
    required: true,
    type: 'string',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  clientName: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    type: 'string',
    description: 'Client email',
  })
  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @ApiPropertyOptional({
    example: '+380981112233',
    type: 'string',
    description: 'Client phone number',
  })
  @IsOptional()
  @IsPhoneNumber()
  clientPhone?: string;
}
