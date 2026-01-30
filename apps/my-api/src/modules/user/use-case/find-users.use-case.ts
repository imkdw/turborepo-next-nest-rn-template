import { Injectable } from '@nestjs/common';
import { User } from '@repo/server-shared';
import { PrismaService } from '@repo/server-shared';

@Injectable()
export class FindUsersUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
