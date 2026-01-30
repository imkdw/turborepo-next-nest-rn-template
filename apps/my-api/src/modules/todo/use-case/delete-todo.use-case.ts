import { Injectable } from '@nestjs/common';
import { Todo } from '@repo/server-shared';
import { PrismaService, TodoNotFoundException } from '@repo/server-shared';

@Injectable()
export class DeleteTodoUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(todoId: string): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      throw new TodoNotFoundException(`Todo with id ${todoId} not found`);
    }

    return this.prisma.todo.delete({
      where: { id: todoId },
    });
  }
}
