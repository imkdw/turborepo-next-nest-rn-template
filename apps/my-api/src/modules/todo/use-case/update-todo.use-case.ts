import { Injectable } from '@nestjs/common';
import { Todo } from '@repo/server-shared';
import { PrismaService, TodoNotFoundException } from '@repo/server-shared';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Injectable()
export class UpdateTodoUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(todoId: string, dto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      throw new TodoNotFoundException(`Todo with id ${todoId} not found`);
    }

    return this.prisma.todo.update({
      where: { id: todoId },
      data: dto,
    });
  }
}
