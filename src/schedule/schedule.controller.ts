import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ScheduleBatchRequestDto, ScheduleResponseDto } from './dto';
import { ScheduleService } from './schedule.service';

import { JwtAuthGuard } from '@/core';
import { CurrentUser, type JwtPayload } from '@/shared';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get week schedule of current user' })
  @ApiOkResponse({
    type: [ScheduleResponseDto],
    description: 'Master week schedule',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserSchedule(@CurrentUser() user: JwtPayload): Promise<ScheduleResponseDto[]> {
    const days = await this.scheduleService.getUserSchedule(user.sub);

    return days.map((day) => plainToInstance(ScheduleResponseDto, day));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update week schedule of the user' })
  @ApiOkResponse({ description: 'Schedule updated', type: [ScheduleResponseDto] })
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUserSchedule(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ScheduleBatchRequestDto,
  ): Promise<ScheduleResponseDto[]> {
    const updatedDays = await this.scheduleService.replaceSchedule(user.sub, dto.items);

    return updatedDays.map((day) => plainToInstance(ScheduleResponseDto, day));
  }
}
