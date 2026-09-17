import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsTimeZone, Matches, MinLength } from 'class-validator';

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
    description: 'Selected date by the client viewing slots',
  })
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
  date: string;

  @IsTimeZone()
  @ApiProperty({ example: 'Europe/Chisinau', description: 'Timezone of the client viewing slots' })
  viewerTimeZone: string;
}
