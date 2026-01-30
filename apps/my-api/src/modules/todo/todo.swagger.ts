import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoDto } from './dto/todo.dto';

export function createTodo(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: CreateTodoDto }),
    ApiCreatedResponse({ type: TodoDto })
  );
}

export function findTodos(summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: [TodoDto] }));
}

export function findTodo(summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: TodoDto }));
}

export function updateTodo(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: UpdateTodoDto }),
    ApiOkResponse({ type: TodoDto })
  );
}

export function deleteTodo(summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: TodoDto }));
}
