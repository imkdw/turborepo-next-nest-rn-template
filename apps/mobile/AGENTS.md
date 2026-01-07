# CLAUDE.md - Mobile (Expo)

> **IMPORTANT**: 이 파일은 Mobile 앱의 구조나 패턴이 변경될 때 반드시 함께 업데이트해야 합니다.

## Quick Reference

| Item         | Value                     |
| ------------ | ------------------------- |
| Framework    | Expo 54 (SDK 54)          |
| React Native | 0.81                      |
| Navigation   | Expo Router 6             |
| Architecture | New Architecture (Fabric) |

## Commands

```bash
# Development
pnpm dev                    # Start Expo dev server
pnpm start                  # Same as dev
pnpm ios                    # Start on iOS simulator
pnpm android                # Start on Android emulator
pnpm web                    # Start web version

# Code Quality
pnpm lint                   # ESLint with auto-fix
pnpm check-types            # TypeScript type check

# Build (Production)
# Use EAS Build - NOT local builds
# eas build --platform ios
# eas build --platform android
```

## Project Structure

```
app/
  _layout.tsx               # Root layout (Stack navigator)
  index.tsx                 # Home screen (WebView)
  [other routes].tsx        # File-based routing

assets/
  images/
    icon.png                # App icon
    splash-icon.png         # Splash screen
    favicon.png             # Web favicon
    android-icon-*.png      # Android adaptive icons

app.json                    # Expo configuration
```

## Expo Router (File-based Routing)

### Route Files

- `app/index.tsx` → `/`
- `app/about.tsx` → `/about`
- `app/[id].tsx` → `/:id` (dynamic)
- `app/(tabs)/` → Tab navigator group

### Layout Files

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}
```

## Code Patterns

### Current Implementation (WebView)

현재 앱은 웹 앱을 WebView로 래핑하는 구조입니다:

```typescript
// app/index.tsx
import { WebView } from 'react-native-webview';

const getWebAppUrl = () => {
  if (!__DEV__) {
    return PRODUCTION_URL;
  }
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:3000`;
};

export default function Index() {
  return <WebView source={{ uri: getWebAppUrl() }} />;
}
```

### Native Component 추가 시

```typescript
import { View, Text, StyleSheet } from 'react-native';

export default function MyScreen() {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## Configuration (app.json)

### Key Settings

```json
{
  "expo": {
    "newArchEnabled": true, // React Native New Architecture
    "experiments": {
      "typedRoutes": true, // Type-safe routing
      "reactCompiler": true // React Compiler
    }
  }
}
```

### Platform-specific

- **iOS**: `supportsTablet: true`
- **Android**: `edgeToEdgeEnabled: true`, adaptive icons 설정

## Code Style Rules

- NEVER use `as any`, `@ts-ignore`, `@ts-expect-error`
- Use `StyleSheet.create()` for styles (not inline objects)
- Use `expo-image` instead of `Image` for better performance
- Prefer `expo-*` packages over raw `react-native-*` when available

## Development Notes

### Android Emulator

- `10.0.2.2` = Host machine's localhost
- 웹 앱 실행 필요 (`pnpm dev` from root)

### iOS Simulator

- `localhost` 직접 접근 가능
- 웹 앱 실행 필요

### Web

- Expo web은 `react-native-web` 사용
- 일부 네이티브 기능 미지원

## Adding New Features

### New Screen

1. `app/` 폴더에 `screen-name.tsx` 생성
2. 자동으로 라우트 등록됨

### New Tab Navigator

1. `app/(tabs)/` 폴더 생성
2. `app/(tabs)/_layout.tsx`에 Tab 설정
3. 각 탭 파일 생성

### Native Module

1. `expo install` 로 패키지 설치
2. `app.json` plugins에 설정 추가 (필요시)
3. Development build 필요할 수 있음

## Build & Deploy

### Development Build (추천)

```bash
# EAS CLI 설치
npm install -g eas-cli

# 빌드
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Build

```bash
eas build --profile production --platform all
```

### 주의사항

- **로컬 빌드 사용 금지**: Native 모듈 문제 발생 가능
- **EAS Build 사용**: 안정적인 빌드 환경 제공
- **Expo Go 제한**: 커스텀 네이티브 코드 시 Development Build 필요

## Common Issues

- **Metro bundler 오류**: `pnpm start --clear` 로 캐시 클리어
- **Android 10.0.2.2 연결 실패**: 웹 앱이 실행 중인지 확인
- **iOS 빌드 실패**: Xcode Command Line Tools 업데이트
- **New Architecture 이슈**: `newArchEnabled: false`로 임시 비활성화 가능
