import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class SignUpRequestDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @Matches(/^[a-z0-9]+(?:_[a-z0-9]+)*$/)
  @ApiPropertyOptional({ example: 'johndoe', description: 'User slug' })
  slug?: string;
}
