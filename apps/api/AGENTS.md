# CLAUDE.md - API (NestJS)

> **IMPORTANT**: 이 파일은 API 앱의 구조나 패턴이 변경될 때 반드시 함께 업데이트해야 합니다.

## Quick Reference

| Item           | Value                     |
| -------------- | ------------------------- |
| Framework      | NestJS 11                 |
| ORM            | Prisma 6                  |
| Port           | 8000                      |
| Swagger        | http://localhost:8000/api |
| API Versioning | URI (`/v1/...`)           |

## Commands

```bash
# Development
pnpm dev                    # Start with watch mode
pnpm start:prod             # Production mode

# Testing
pnpm test                   # Run unit + integration tests
pnpm test:unit              # Unit tests only
pnpm test:integration       # Integration tests only (requires DB)
pnpm test:e2e               # E2E tests (requires DB)

# Database
pnpm prisma studio          # Open Prisma Studio
pnpm prisma generate        # Generate Prisma client
pnpm prisma db push         # Push schema to DB

# Code Quality
pnpm lint                   # ESLint with auto-fix
pnpm check-types            # TypeScript type check
```

## Project Structure

```
src/
  modules/                  # Feature modules
    <feature>/
      <feature>.module.ts   # Module definition
      <feature>.controller.ts
      <feature>.swagger.ts  # Swagger decorators (separate file)
      dto/                  # Request/Response DTOs
      use-case/             # Business logic (one class per use-case)
      exception/            # Feature-specific exceptions
  infra/
    database/               # Prisma service and module
  app.module.ts             # Root module
  app.controller.ts         # Health check endpoint
  main.ts                   # Bootstrap (CORS, Swagger, Helmet, etc.)

prisma/
  schema/
    schema.prisma           # Prisma config + generator
    user.prisma             # User model (example)

test/
  unit/                     # Unit tests (no DB)
  integration/              # Integration tests (with DB)
  e2e/                      # End-to-end HTTP tests
```

## Code Patterns

### Use-Case Pattern (MUST FOLLOW)

각 비즈니스 로직은 별도의 Use-Case 클래스로 분리합니다:

```typescript
// use-case/create-user.use-case.ts
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: { ... } });
  }
}
```

- 하나의 Use-Case = 하나의 작업
- `execute()` 메서드만 사용
- Controller는 얇게 유지 - Use-Case에 위임

### Controller Pattern

```typescript
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase
    // ... other use-cases
  ) {}

  @Swagger.createUser('유저 생성')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
}
```

### Swagger Decorators (MUST FOLLOW)

Swagger 데코레이터는 별도 파일로 분리합니다:

```typescript
// user.swagger.ts
export function createUser(summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiResponse({ status: 201, type: UserResponseDto }));
}
```

### Exception Handling

```typescript
import { CustomException } from '@repo/server-shared';
import { EXCEPTION_CODES } from '@repo/exception';

throw new CustomException({
  message: 'User not found',
  errorCode: EXCEPTION_CODES.USER_NOT_FOUND,
  statusCode: 404,
});
```

## Code Style Rules

- Path alias: `@/` → `src/` (e.g., `@/modules/user`)
- NEVER use `as any`, `@ts-ignore`, `@ts-expect-error`
- NEVER use `console.log` - use Winston logger
- Destructure imports when possible
- Use `class-validator` decorators for DTO validation

## Testing Guidelines

### Unit Tests (`test/unit/`)

- **DTO validation 테스트에 집중** - `class-validator`의 `validate()` 함수 사용
- 외부 의존성 없이 순수 로직만 테스트
- 파일명: `*.spec.ts`
- 디렉토리 구조: `test/unit/modules/<feature>/<dto-name>.spec.ts`

```typescript
// test/unit/modules/user/create-user.dto.spec.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';

describe('CreateUserDto', () => {
  const createDto = (data: Partial<CreateUserDto>) => {
    return plainToInstance(CreateUserDto, data);
  };

  it('should pass with valid data', async () => {
    const dto = createDto({ email: 'test@example.com', name: 'Test User' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    const dto = createDto({ email: 'invalid', name: 'Test' });
    const errors = await validate(dto);
    expect(errors[0]?.property).toBe('email');
  });
});
```

### Integration Tests (`test/integration/`)

- **Use-Case + 실제 DB 연동 테스트**
- 실제 DB 연결 필요 (Docker 컨테이너 실행 상태여야 함)
- 파일명: `*.spec.ts`
- 디렉토리 구조: `test/integration/modules/<feature>/<use-case-name>.spec.ts`

```typescript
// test/integration/modules/user/find-user.use-case.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FindUserUseCase } from '@/modules/user/use-case/find-user.use-case';
import { PrismaService } from '@repo/server-shared';

describe('FindUserUseCase (Integration)', () => {
  let useCase: FindUserUseCase;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindUserUseCase, PrismaService],
    }).compile();

    useCase = module.get<FindUserUseCase>(FindUserUseCase);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('should find user from database', async () => {
    // 실제 DB 데이터로 테스트
  });
});
```

### E2E Tests (`test/e2e/`)

- `supertest`로 HTTP 요청 테스트
- 전체 애플리케이션 부트스트랩 후 테스트
- 파일명: `*.spec-e2e.ts`

## Environment Variables

```bash
DATABASE_URL=postgresql://...     # Required
API_PORT=8000                     # Required
APP_ENV=local|staging|production  # Required
SWAGGER_USERNAME=xxx              # Required for non-local
SWAGGER_PASSWORD=xxx              # Required for non-local
```

## Adding New Feature Module

1. `src/modules/<feature>/` 디렉토리 생성
2. 다음 파일들 생성:
   - `<feature>.module.ts`
   - `<feature>.controller.ts`
   - `<feature>.swagger.ts`
   - `dto/` 폴더
   - `use-case/` 폴더
3. `app.module.ts`에 모듈 등록
4. 필요시 `packages/shared/exception/`에 에러 코드 추가

## Common Issues

- **Prisma 타입 오류**: `pnpm prisma generate` 실행
- **DB 연결 실패**: Docker 컨테이너 확인 (`docker-compose up -d`)
- **테스트 DB 오류**: `.env.test` 파일 확인
