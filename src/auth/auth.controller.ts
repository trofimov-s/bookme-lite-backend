import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { CookieOptions, Request, Response } from 'express';

import { AuthService } from './auth.service';
import { AuthResponseDto, LoginRequestDto, SignUpRequestDto } from './dto';

import { EnvKeys } from '@/shared';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly isProduction: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.isProduction = configService.get(EnvKeys.NODE_ENV) === 'production';
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully', type: AuthResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() data: SignUpRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } = await this.authService.register(data);

    this.setRefreshTokenCookie(response, refreshToken);

    return plainToInstance(AuthResponseDto, { accessToken });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ description: 'User logged in successfully', type: AuthResponseDto })
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginRequestDto, @Res({ passthrough: true }) response: Response): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } = await this.authService.login(data);

    this.setRefreshTokenCookie(response, refreshToken);

    return plainToInstance(AuthResponseDto, { accessToken });
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ description: 'Tokens pair refreshed', type: AuthResponseDto })
  @HttpCode(HttpStatus.OK)
  refresh(@Req() request: Request) {
    const refreshToken = request.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const authResponse = this.authService.refreshAccessToken(refreshToken);

    return plainToInstance(AuthResponseDto, authResponse);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Clear refreshToken from cookie' })
  @ApiOkResponse({ description: 'Logout successfully' })
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', this.getCookieOptions());

    return { ok: true };
  }

  private setRefreshTokenCookie(response: Response, refreshToken: string) {
    response.cookie('refreshToken', refreshToken, this.getCookieOptions());
  }

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'lax',
    };
  }
}
