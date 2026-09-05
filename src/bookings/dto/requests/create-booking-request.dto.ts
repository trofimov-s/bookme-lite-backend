import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
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
    example: '2026-09-04',
    required: true,
    format: 'date',
  })
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
  date: string;

  @ApiProperty({
    example: 540,
    required: true,
    type: 'integer',
  })
  @IsInt()
  @Min(0)
  @Max(1440)
  startTime: number;

  @ApiProperty({
    example: 570,
    required: true,
    type: 'integer',
  })
  @IsInt()
  @Min(0)
  @Max(1440)
  endTime: number;

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
