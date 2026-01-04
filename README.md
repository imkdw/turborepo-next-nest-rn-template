# Turborepo Next.js + NestJS + React Native 템플릿

Turborepo 기반의 프로덕션 레디 모노레포 템플릿입니다. Next.js 웹 프론트엔드, NestJS 백엔드 API, React Native 모바일 앱을 위한 구조를 제공하며, 타입, 유틸리티, UI 컴포넌트, 설정 파일 등을 공유 패키지로 관리합니다.

<br>

## 기술 스택

| 분류       | 기술                                           |
| ---------- | ---------------------------------------------- |
| 모노레포   | Turborepo + pnpm workspaces                    |
| 프론트엔드 | Next.js 16 (Turbopack), React 19, Tailwind CSS |
| 백엔드     | NestJS 11, Prisma ORM, PostgreSQL              |
| 모바일     | Expo 54, React Native 0.81, Expo Router        |
| 언어       | TypeScript 5.9 (strict 모드)                   |
| 코드 품질  | ESLint, Prettier, Husky                        |

<br>

## 프로젝트 구조

```
turborepo-next-nest-rn-template/
├── apps/
│   ├── api/                  # @repo/api - NestJS 백엔드
│   │   ├── prisma/           # Prisma 스키마 및 마이그레이션
│   │   ├── src/              # 애플리케이션 소스 코드
│   │   └── test/             # 단위 및 통합 테스트
│   ├── web/                  # @repo/web - Next.js 프론트엔드
│   │   └── src/              # 애플리케이션 소스 코드
│   └── app/                  # @repo/app - Expo 모바일 앱
├── packages/
│   ├── ui/                   # @repo/ui - 공유 React 컴포넌트
│   ├── eslint-config/        # @repo/eslint-config - ESLint 설정
│   ├── typescript-config/    # @repo/typescript-config - TypeScript 설정
│   └── shared/
│       ├── types/            # @repo/types - 공유 TypeScript 타입
│       ├── utils/            # @repo/utils - 공유 유틸리티
│       ├── consts/           # @repo/consts - 공유 상수
│       └── exception/        # @repo/exception - 공유 예외 처리
├── docker-compose.yml        # PostgreSQL 데이터베이스
├── turbo.json                # Turborepo 설정
└── package.json              # 루트 package.json
```

<br>

## 사전 요구사항

| 요구사항 | 버전                      |
| -------- | ------------------------- |
| Node.js  | >= 22                     |
| pnpm     | 10.0.0                    |
| Docker   | PostgreSQL 데이터베이스용 |

<br>

## 시작하기

### 1. 저장소 복제 및 의존성 설치

```bash
git clone <repository-url>
cd turborepo-next-nest-rn-template
pnpm install
```

<br>

### 2. 환경 변수 설정

`apps/api/` 디렉토리에 `.env` 파일을 생성합니다:

```bash
# apps/api/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:6432/mydb?schema=public"
```

<br>

### 3. 데이터베이스 시작 및 스키마 초기화

```bash
pnpm setup:local
```

<br>

이 명령어는 Docker로 PostgreSQL을 시작하고 Prisma 스키마를 데이터베이스에 푸시합니다.

<br>

### 4. 개발 서버 시작

```bash
pnpm dev
```

모든 애플리케이션이 개발 모드로 시작됩니다:

| 서비스             | URL                       |
| ------------------ | ------------------------- |
| 웹                 | http://localhost:3000     |
| API                | http://localhost:8000     |
| API 문서 (Swagger) | http://localhost:8000/api |

<br>

## 사용 가능한 스크립트

### 루트 스크립트

| 스크립트           | 설명                                 |
| ------------------ | ------------------------------------ |
| `pnpm dev`         | 모든 앱을 개발 모드로 시작           |
| `pnpm build`       | 모든 앱과 패키지 빌드                |
| `pnpm lint`        | 전체 코드 린트 (자동 수정 포함)      |
| `pnpm check-types` | TypeScript 타입 검사 실행            |
| `pnpm test`        | 모든 테스트 실행                     |
| `pnpm format`      | Prettier로 모든 파일 포맷팅          |
| `pnpm clean`       | node_modules, dist, tsbuildinfo 삭제 |
| `pnpm setup:local` | Docker 시작 + Prisma 스키마 푸시     |

<br>

### 패키지 필터 스크립트

특정 패키지에서 명령어를 실행할 때 사용하는 단축 스크립트입니다:

```bash
pnpm api <명령어>       # @repo/api에서 실행
pnpm web <명령어>       # @repo/web에서 실행
pnpm app <명령어>       # @repo/app에서 실행
pnpm ui <명령어>        # @repo/ui에서 실행
pnpm types <명령어>     # @repo/types에서 실행
pnpm utils <명령어>     # @repo/utils에서 실행
pnpm consts <명령어>    # @repo/consts에서 실행
pnpm exception <명령어> # @repo/exception에서 실행
```

사용 예시:

```bash
pnpm api prisma studio   # Prisma Studio 열기
pnpm api test:unit       # API 단위 테스트 실행
pnpm web build           # 웹 앱만 빌드
```

<br>

## 애플리케이션

### @repo/api (NestJS 백엔드)

완전한 기능을 갖춘 백엔드 API:

- **NestJS 11** - Express 플랫폼 기반
- **Prisma ORM** - PostgreSQL 연동
- **Swagger** - `/api` 경로에서 API 문서 제공
- **Class-validator** - 요청 유효성 검사
- **Helmet** - 보안 헤더 설정
- **Jest** - 단위 및 통합 테스트

주요 명령어:

```bash
pnpm api dev              # 개발 모드로 시작 (watch 모드)
pnpm api build            # 프로덕션 빌드
pnpm api test             # 모든 테스트 실행
pnpm api test:unit        # 단위 테스트 실행
pnpm api test:integration # 통합 테스트 실행
pnpm api prisma studio    # Prisma Studio 열기
pnpm api prisma generate  # Prisma 클라이언트 생성
```

### @repo/web (Next.js 프론트엔드)

최신 웹 애플리케이션:

- **Next.js 16** - Turbopack으로 빠른 개발 환경
- **React 19** - 최신 기능 지원
- **Tailwind CSS** - typography 플러그인 포함
- **@repo/ui** - 공유 UI 컴포넌트 사용
- **다크 모드** - next-themes 지원

주요 명령어:

```bash
pnpm web dev    # Turbopack으로 개발 서버 시작
pnpm web build  # 프로덕션 빌드
pnpm web start  # 프로덕션 서버 시작
```

### @repo/app (Expo 모바일 앱)

최신 React Native 모바일 애플리케이션:

- **Expo SDK 54** - 최신 Expo 플랫폼
- **React Native 0.81** - New Architecture 활성화
- **Expo Router** - 파일 기반 라우팅 (Typed Routes)
- **React 19** - React Compiler 활성화
- **React Navigation** - 네비게이션 라이브러리
- **다크 모드** - 시스템 테마 자동 감지

주요 명령어:

```bash
pnpm app start    # Expo 개발 서버 시작
pnpm app ios      # iOS 시뮬레이터에서 실행
pnpm app android  # Android 에뮬레이터에서 실행
pnpm app web      # 웹 브라우저에서 실행
```

> **참고**: 프로덕션 빌드는 [EAS Build](https://docs.expo.dev/build/introduction/)를 사용합니다.

<br>

## 패키지

### @repo/ui

공유 React 컴포넌트 라이브러리:

- **CVA** (class-variance-authority) - 컴포넌트 변형 관리
- **cn()** 유틸리티 - clsx + tailwind-merge 조합
- **Tailwind 프리셋** - shadcn/ui 스타일 디자인 토큰
- **다크 모드** - `darkMode: 'class'` 지원

사용 방법:

```typescript
import { cn, cva, type VariantProps } from '@repo/ui'; // 유틸리티 함수
import '@repo/ui/globals.css'; // 글로벌 스타일
import tailwindPreset from '@repo/ui/tailwind-preset'; // Tailwind 프리셋
```

### @repo/typescript-config

공유 TypeScript 설정:

| 파일                 | 용도               |
| -------------------- | ------------------ |
| `base.json`          | 기본 strict 설정   |
| `nestjs.json`        | NestJS 프로젝트용  |
| `nextjs.json`        | Next.js 프로젝트용 |
| `react-library.json` | React 라이브러리용 |

### @repo/eslint-config

공유 ESLint 설정:

| 설정             | 용도               |
| ---------------- | ------------------ |
| `base`           | 기본 설정          |
| `nestjs`         | NestJS 프로젝트용  |
| `next-js`        | Next.js 프로젝트용 |
| `react-internal` | React 라이브러리용 |

<br>

### 공유 패키지

| 패키지          | 설명                                             |
| --------------- | ------------------------------------------------ |
| @repo/types     | 크로스 플랫폼 TypeScript 타입 정의               |
| @repo/utils     | 공유 유틸리티 함수 (client/server 별도 내보내기) |
| @repo/consts    | 공유 상수                                        |
| @repo/exception | 공유 예외 처리                                   |

<br>

## 개발 워크플로우

<br>

### 특정 앱만 실행하기

```bash
# API만 실행
turbo dev --filter=@repo/api

# 웹 앱만 실행
turbo dev --filter=@repo/web

# API와 의존성 패키지 함께 실행
turbo dev --filter=@repo/api...
```

<br>

### 빌드

```bash
# 전체 빌드
pnpm build

# 특정 앱만 빌드
turbo build --filter=@repo/web
```

<br>

### 테스트

```bash
# 전체 테스트 실행
pnpm test

# API 테스트만 실행
pnpm api test

# 특정 테스트 타입 실행
pnpm api test:unit
pnpm api test:integration
```

<br>

## 환경 변수

### API (@repo/api)

| 변수           | 설명                   | 기본값 |
| -------------- | ---------------------- | ------ |
| `DATABASE_URL` | PostgreSQL 연결 문자열 | 필수   |
| `PORT`         | API 서버 포트          | 8000   |

`.env` 파일 예시:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:6432/mydb?schema=public"
```

<br>

## 인프라

### Docker Compose

PostgreSQL 16.8 데이터베이스 설정:

| 속성          | 값                   |
| ------------- | -------------------- |
| 컨테이너 이름 | my-monorepo-postgres |
| 호스트 포트   | 6432                 |
| 데이터베이스  | mydb                 |
| 사용자        | postgres             |
| 비밀번호      | postgres             |

명령어:

```bash
# 데이터베이스 시작
docker-compose up -d

# 데이터베이스 중지
docker-compose down

# 로그 확인
docker-compose logs -f postgres
```

<br>

### Git Hooks (Husky)

| 훅       | 동작                     |
| -------- | ------------------------ |
| pre-push | 푸시 전 `pnpm lint` 실행 |

<br>

## 원격 캐싱

Turborepo는 빌드 결과물을 여러 머신에서 공유할 수 있는 원격 캐싱을 지원합니다:

```bash
# Vercel에 로그인
turbo login

# 원격 캐시 연결
turbo link
```

<br>

## 참고 자료

- [Turborepo 문서](https://turborepo.com/docs)
- [Next.js 문서](https://nextjs.org/docs)
- [NestJS 문서](https://docs.nestjs.com)
- [Expo 문서](https://docs.expo.dev)
- [Prisma 문서](https://www.prisma.io/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
