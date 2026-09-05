import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Matches, MinLength } from 'class-validator';

export class GetSlotsQueryRequestDto {
  @ApiProperty({
    example: 'johndoe',
    required: true,
    minLength: 3,
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
}
