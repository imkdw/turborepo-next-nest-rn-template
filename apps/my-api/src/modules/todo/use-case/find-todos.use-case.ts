import { Injectable } from '@nestjs/common';
import { Todo } from '@repo/server-shared';
import { PrismaService } from '@repo/server-shared';

@Injectable()
export class FindTodosUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }
}
