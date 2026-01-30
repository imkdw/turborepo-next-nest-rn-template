import { Injectable } from '@nestjs/common';
import { User } from '@repo/server-shared';
import { PrismaService, UserNotFoundException } from '@repo/server-shared';

@Injectable()
export class FindUserUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UserNotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }
}
