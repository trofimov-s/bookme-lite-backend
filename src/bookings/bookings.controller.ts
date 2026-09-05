import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { BookingsService } from './bookings.service';
import {
  BookingItemResponseDto,
  CreateBookingRequestDto,
  CreateBookingResponseDto,
  GetSlotsQueryRequestDto,
  SlotResponseDto,
} from './dto';

import { JwtAuthGuard } from '@/core';
import { CurrentUser, type JwtPayload } from '@/shared';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Get all slots for a selected date' })
  @ApiOkResponse({
    type: SlotResponseDto,
    description: 'Returns response with selected date and free slots',
  })
  @Get()
  async getSlots(@Query() queries: GetSlotsQueryRequestDto) {
    return this.bookingsService.getUserSlots(queries.slug, queries.date);
  }

  @ApiOperation({ summary: 'Create a booking' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    summary: 'Booking was created',
    type: CreateBookingResponseDto,
  })
  @Post()
  async createBooking(@Body() dto: CreateBookingRequestDto): Promise<CreateBookingResponseDto> {
    const booking = await this.bookingsService.createBooking(dto);

    return plainToInstance(CreateBookingResponseDto, booking);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings of a user' })
  @ApiOkResponse({
    type: [BookingItemResponseDto],
    description: 'Returns a list of bookings for the current client',
  })
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getUserBookings(@CurrentUser() user: JwtPayload) {
    const bookings = await this.bookingsService.getUserBookings(user.sub);

    return bookings.map((item) => plainToInstance(BookingItemResponseDto, item));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancellation of visit' })
  @ApiOkResponse({
    description: 'Booking cancelled successfully',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelBooking(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    await this.bookingsService.cancelBooking(user.sub, id);

    return { ok: true };
  }
}
