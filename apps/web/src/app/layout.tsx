import type { Metadata } from 'next';
import { cn } from '@repo/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'My App description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background antialiased')}>{children}</body>
    </html>
  );
}
