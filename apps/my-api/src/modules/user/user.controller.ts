import { CreateUserUseCase } from '@/modules/user/use-case/create-user.use-case';
import { FindUserUseCase } from '@/modules/user/use-case/find-user.use-case';
import { FindUsersUseCase } from '@/modules/user/use-case/find-users.use-case';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import * as Swagger from './user.swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase
  ) {}

  @Swagger.createUser('유저 생성')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Swagger.findUsers('유저 목록 조회')
  @Get()
  async findAll() {
    return this.findUsersUseCase.execute();
  }

  @Swagger.findUser('유저 단건 조회')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.findUserUseCase.execute(id);
  }
}
