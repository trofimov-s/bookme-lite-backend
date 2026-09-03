import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { EnvKeys, type JwtPayload } from '@/shared';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly JWT_ACCESS_SECRET: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_ACCESS_SECRET = configService.getOrThrow<string>(EnvKeys.JWT_ACCESS_SECRET);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Not authorized');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Not authorized');
    }

    try {
      const user = this.verify(token);

      request.user = user;
    } catch {
      throw new UnauthorizedException('Not authorized');
    }

    return true;
  }

  private verify(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, { secret: this.JWT_ACCESS_SECRET });
  }
}
