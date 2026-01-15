import { Test, TestingModule } from '@nestjs/testing';
import { FindUserUseCase } from '@/modules/user/use-case/find-user.use-case';
import { CreateUserUseCase } from '@/modules/user/use-case/create-user.use-case';
import { PrismaService, UserNotFoundException } from '@repo/server-shared';
import { randomUUID } from 'crypto';

describe('FindUserUseCase (Integration)', () => {
  let findUserUseCase: FindUserUseCase;
  let createUserUseCase: CreateUserUseCase;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindUserUseCase, CreateUserUseCase, PrismaService],
    }).compile();

    findUserUseCase = module.get<FindUserUseCase>(FindUserUseCase);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.onModuleInit();
  });

  afterAll(async () => {
    await prismaService.onModuleDestroy();
  });

  describe('execute', () => {
    it('should find a user from database', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      const testName = 'Integration Test User';

      const createdUser = await createUserUseCase.execute({
        email: testEmail,
        name: testName,
      });

      const foundUser = await findUserUseCase.execute(createdUser.id);

      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.email).toBe(testEmail);
      expect(foundUser.name).toBe(testName);
    });

    it('should throw UserNotFoundException for non-existent user', async () => {
      const nonExistentId = randomUUID();

      await expect(findUserUseCase.execute(nonExistentId)).rejects.toThrow(UserNotFoundException);
    });
  });
});
