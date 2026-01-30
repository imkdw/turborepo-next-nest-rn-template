import { Injectable } from '@nestjs/common';
import { Todo } from '@repo/server-shared';
import { PrismaService } from '@repo/server-shared';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateTodoUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateTodoDto): Promise<Todo> {
    return this.prisma.todo.create({
      data: {
        id: randomUUID(),
        title: dto.title,
        content: dto.content,
      },
    });
  }
}
