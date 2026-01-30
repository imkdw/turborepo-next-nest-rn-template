import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from '@/modules/user/use-case/create-user.use-case';
import { FindUserUseCase } from '@/modules/user/use-case/find-user.use-case';
import { FindUsersUseCase } from '@/modules/user/use-case/find-users.use-case';

@Module({
  controllers: [UserController],
  providers: [CreateUserUseCase, FindUserUseCase, FindUsersUseCase],
})
export class UserModule {}
