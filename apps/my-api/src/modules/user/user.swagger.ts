import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

export function createUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: CreateUserDto }),
    ApiCreatedResponse({ type: UserDto })
  );
}

export function findUsers(summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: [UserDto] }));
}

export function findUser(summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: UserDto }));
}
