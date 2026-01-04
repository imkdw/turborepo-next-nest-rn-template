import type { ReactNode } from 'react';
import { Zap, Blocks, Smartphone } from 'lucide-react';

export default function Home(): ReactNode {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="px-5 pb-8 pt-12 md:px-8 md:pb-16 md:pt-20">
        <section className="mx-auto max-w-md md:max-w-2xl">
          <div className="mb-6 flex justify-center md:mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg md:h-20 md:w-20">
              <span className="text-2xl font-bold text-primary-foreground md:text-3xl">M</span>
            </div>
          </div>

          <div className="mb-10 text-center md:mb-14">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:mb-4 md:text-5xl">모노레포 앱</h1>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              웹과 모바일을 하나로 연결하는
              <br className="md:hidden" />
              <span className="md:ml-1">통합 개발 플랫폼</span>
            </p>
          </div>

          <div className="mb-10 space-y-3 md:mb-14 md:space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary md:h-12 md:w-12">
                  <Zap className="h-5 w-5 text-secondary-foreground md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-semibold text-card-foreground">빠른 개발 속도</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Turborepo와 함께 모든 앱을 동시에 개발하고 배포하세요
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary md:h-12 md:w-12">
                  <Blocks className="h-5 w-5 text-secondary-foreground md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-semibold text-card-foreground">코드 공유</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    타입, 유틸리티, UI 컴포넌트를 모든 플랫폼에서 재사용
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary md:h-12 md:w-12">
                  <Smartphone className="h-5 w-5 text-secondary-foreground md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-semibold text-card-foreground">크로스 플랫폼</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Next.js 웹과 React Native 앱을 하나의 저장소에서 관리
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/50 p-5 text-center md:p-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary md:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              WebView 테스트
            </div>
            <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">정상적으로 렌더링되었습니다</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              이 페이지가 보인다면 WebView 연동이 성공한 것입니다
            </p>
          </div>

          <footer className="mt-10 text-center md:mt-14">
            <p className="text-xs text-muted-foreground md:text-sm">© 2026 모노레포 템플릿</p>
          </footer>
        </section>
      </div>
    </main>
  );
}
