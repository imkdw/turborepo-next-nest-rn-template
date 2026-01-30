import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { CreateTodoUseCase } from '@/modules/todo/use-case/create-todo.use-case';
import { DeleteTodoUseCase } from '@/modules/todo/use-case/delete-todo.use-case';
import { FindTodoUseCase } from '@/modules/todo/use-case/find-todo.use-case';
import { FindTodosUseCase } from '@/modules/todo/use-case/find-todos.use-case';
import { UpdateTodoUseCase } from '@/modules/todo/use-case/update-todo.use-case';

@Module({
  controllers: [TodoController],
  providers: [CreateTodoUseCase, DeleteTodoUseCase, FindTodoUseCase, FindTodosUseCase, UpdateTodoUseCase],
})
export class TodoModule {}
