import { ConflictException, Injectable } from '@nestjs/common';

import { CreateUserData } from './models';

import { Prisma, User } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          name: data.name,
          slug: data.slug,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({
          message: 'User with this email or slug already exists',
        });
      }

      throw error;
    }
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findBySlug(slug: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { slug },
    });
  }
}
