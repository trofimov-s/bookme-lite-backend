import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { UserResponseDto } from './dto';
import { UsersService } from './users.service';

import { JwtAuthGuard } from '@/core';
import { CurrentUser, type JwtPayload } from '@/shared';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    type: UserResponseDto,
    description: 'Get current user',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMe(@CurrentUser() payload: JwtPayload): Promise<UserResponseDto> {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponseDto, user);
  }
}
