import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@repo/server-shared';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        id: randomUUID(),
        email: dto.email,
        name: dto.name,
      },
    });
  }
}
