import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import type { AuthResponseDto, LoginRequestDto, SignUpRequestDto } from './dto';

import { EnvKeys, type JwtPayload } from '@/shared';
import { UsersService } from '@/users';

@Injectable()
export class AuthService {
  private readonly JWT_REFRESH_SECRET: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_REFRESH_SECRET = this.configService.getOrThrow<string>(EnvKeys.JWT_REFRESH_SECRET);
  }

  async register(data: SignUpRequestDto) {
    const hashedPassword = await this.hashPassword(data.password);

    const user = await this.usersService.create({
      email: data.email,
      passwordHash: hashedPassword,
      name: data.name,
      slug: data.slug,
    });

    const tokens = this.generateTokenPair(user.id, user.email);

    return tokens;
  }

  async login(data: LoginRequestDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.verifyPassword(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokenPair(user.id, user.email);

    return tokens;
  }

  refreshAccessToken(refreshToken: string): AuthResponseDto {
    try {
      const jwtPayload = this.jwtService.verify<JwtPayload>(refreshToken, { secret: this.JWT_REFRESH_SECRET });
      const accessToken = this.jwtService.sign({ sub: jwtPayload.sub, email: jwtPayload.email });

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }

  private generateTokenPair(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d', secret: this.JWT_REFRESH_SECRET });

    return { accessToken, refreshToken };
  }
}
