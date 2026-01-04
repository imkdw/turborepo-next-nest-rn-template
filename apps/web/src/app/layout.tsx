import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cn } from '@repo/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'My App description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background antialiased')}>{children}</body>
    </html>
  );
}
