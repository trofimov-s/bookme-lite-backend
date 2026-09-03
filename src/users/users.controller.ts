import { Controller, Get, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { Request } from 'express';

import { UserResponseDto } from './dto';
import { UsersService } from './users.service';

import { JwtAuthGuard } from '@/core';

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
  async getMe(@Req() request: Request): Promise<UserResponseDto | null> {
    const user = await this.usersService.findById(request.user!.sub);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponseDto, user);
  }
}
