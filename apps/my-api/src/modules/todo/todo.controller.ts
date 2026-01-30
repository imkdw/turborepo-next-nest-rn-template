import { CreateTodoUseCase } from '@/modules/todo/use-case/create-todo.use-case';
import { DeleteTodoUseCase } from '@/modules/todo/use-case/delete-todo.use-case';
import { FindTodoUseCase } from '@/modules/todo/use-case/find-todo.use-case';
import { FindTodosUseCase } from '@/modules/todo/use-case/find-todos.use-case';
import { UpdateTodoUseCase } from '@/modules/todo/use-case/update-todo.use-case';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import * as Swagger from './todo.swagger';

@ApiTags('Todos')
@Controller('todos')
export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
    private readonly findTodoUseCase: FindTodoUseCase,
    private readonly findTodosUseCase: FindTodosUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase
  ) {}

  @Swagger.createTodo('Todo 생성')
  @Post()
  async create(@Body() dto: CreateTodoDto) {
    return this.createTodoUseCase.execute(dto);
  }

  @Swagger.findTodos('Todo 목록 조회')
  @Get()
  async findAll() {
    return this.findTodosUseCase.execute();
  }

  @Swagger.findTodo('Todo 단건 조회')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.findTodoUseCase.execute(id);
  }

  @Swagger.updateTodo('Todo 수정')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.updateTodoUseCase.execute(id, dto);
  }

  @Swagger.deleteTodo('Todo 삭제')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deleteTodoUseCase.execute(id);
  }
}
