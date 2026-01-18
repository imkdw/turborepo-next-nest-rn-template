# Turborepo Next.js + NestJS + React Native + Electron 템플릿

Next.js 웹, NestJS API, Expo 모바일 앱, Electron 데스크톱 앱을 위한 Turborepo 모노레포 템플릿

## 빠른 시작

```bash
# 1. 저장소 복제
git clone <repository-url> my-project
cd my-project

# 2. 의존성 설치
pnpm install

# 3. 환경 변수 설정 (apps/api/.env 생성)
cp .env.example apps/api/.env

# 4. 데이터베이스 시작 + 스키마 초기화
pnpm setup:local

# 5. 개발 서버 시작
pnpm dev
```

**접속 URL**

- 웹: http://localhost:3000
- API: http://localhost:8000
- Swagger: http://localhost:8000/api

## 템플릿 커스터마이징

복제 후 프로젝트에 맞게 수정해야 할 항목들:

### 필수 변경

| 파일                              | 변경 항목                                |
| --------------------------------- | ---------------------------------------- |
| `package.json`                    | `name` 필드 (`my-monorepo` → 프로젝트명) |
| `docker-compose.yml`              | `container_name`, `POSTGRES_DB`          |
| `apps/api/.env`                   | `DATABASE_URL`의 DB명, 포트 등           |
| `apps/api/prisma/schema/*.prisma` | 실제 도메인 모델로 교체                  |
| `apps/web/src/messages/*.json`    | i18n 메시지                              |
| `apps/mobile/app.json`            | `name`, `slug`, `bundleIdentifier` 등    |

### 선택 변경

| 파일                         | 변경 항목      |
| ---------------------------- | -------------- |
| `packages/shared/exception/` | 에러 코드 정의 |
| `packages/shared/consts/`    | 공유 상수      |
| `.husky/pre-push`            | Git hook 설정  |

## 앱 생성 (CLI)

템플릿에서 새로운 앱을 빠르게 생성할 수 있습니다.

```bash
# 인터랙티브 모드
pnpm create-app

# CLI 모드
pnpm create-app <앱-이름> --from <템플릿>

# 예시
pnpm create-app my-app --from mobile
pnpm create-app admin-panel --from web
pnpm create-app new-api --from api
```

**사용 가능한 템플릿**

| 템플릿    | 설명                        |
| --------- | --------------------------- |
| `mobile`  | Expo React Native 모바일 앱 |
| `desktop` | Electron 데스크톱 앱        |
| `web`     | Next.js 웹 앱               |
| `api`     | NestJS 백엔드 API           |

**옵션**

| 옵션             | 설명                          |
| ---------------- | ----------------------------- |
| `--from, -f`     | 사용할 템플릿 지정            |
| `--dry-run`      | 실제 생성 없이 미리보기       |
| `--skip-install` | 생성 후 pnpm install 건너뛰기 |
| `--list`         | 사용 가능한 템플릿 목록 표시  |
| `--help`         | 도움말 표시                   |

생성된 앱은 `apps/<앱-이름>` 경로에 위치하며, 자동으로:
- 패키지 이름이 `@repo/<앱-이름>`으로 설정됨
- 루트 `package.json`에 `pnpm <앱-이름>` 스크립트 추가
- 린트 및 빌드 검증 실행 (desktop, mobile 제외)

## 주요 명령어

```bash
# 개발
pnpm dev                # 웹 + API 개발 서버
pnpm dev:mobile         # 모바일 앱 (별도 실행)
pnpm dev:desktop        # 데스크톱 앱 (별도 실행)

# 앱 생성
pnpm create-app         # 새로운 앱 생성 (인터랙티브)

# 빌드 & 검증
pnpm build              # 전체 빌드
pnpm lint               # 린트 (자동 수정)
pnpm check-types        # 타입 체크
pnpm test               # 테스트

# 데이터베이스
pnpm setup:local        # Docker + Prisma 초기화
pnpm api prisma studio  # Prisma Studio
pnpm api prisma generate # Prisma 클라이언트 생성

# 패키지별 실행
pnpm api <명령어>       # API 패키지
pnpm web <명령어>       # 웹 패키지
pnpm mobile <명령어>    # 모바일 패키지
pnpm desktop <명령어>   # 데스크톱 패키지
```

## 프로젝트 구조

```
apps/
  api/        # NestJS 11 백엔드 (Prisma, Swagger)
  web/        # Next.js 16 프론트엔드 (Turbopack, next-intl)
  mobile/     # Expo 54 모바일 (Expo Router)
  desktop/    # Electron 39 데스크톱 (electron-forge)

packages/
  ui/                    # 공유 React 컴포넌트 (CVA, Tailwind)
  eslint-config/         # ESLint 프리셋
  typescript-config/     # TypeScript 프리셋
  server-shared/         # NestJS 공유 모듈 (필터, 인터셉터)
  i18n/                  # i18n 설정
  shared/
    types/               # 공유 타입
    consts/              # 공유 상수
    exception/           # 에러 코드
    utils/               # 유틸리티

templates/               # 앱 생성 CLI용 템플릿
  mobile/                # 모바일 앱 템플릿
  desktop/               # 데스크톱 앱 템플릿
  web/                   # 웹 앱 템플릿
  api/                   # API 템플릿

scripts/
  create-app.ts          # 앱 생성 CLI 스크립트
```

## 환경 변수

`apps/api/.env` 파일 예시:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:7432/turborepo-template-postgres?schema=public"
API_PORT=8000
APP_ENV=local

# Swagger 인증 (local 환경에서는 불필요)
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=password
```

## 기술 스택

| 분류     | 기술                               |
| -------- | ---------------------------------- |
| 모노레포 | Turborepo + pnpm                   |
| 백엔드   | NestJS 11, Prisma, PostgreSQL      |
| 웹       | Next.js 16, React 19, Tailwind CSS |
| 모바일   | Expo 54, React Native 0.81         |
| 데스크톱 | Electron 39, electron-forge        |
| 언어     | TypeScript 5.9 (strict)            |

## 참고

- Node.js 22 이상, pnpm 10, Docker 필요
- 모바일 프로덕션 빌드는 [EAS Build](https://docs.expo.dev/build/introduction/) 사용
- 원격 캐싱: `turbo login && turbo link`