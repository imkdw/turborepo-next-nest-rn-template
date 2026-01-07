import type { ReactNode } from 'react';
import { cn } from '@repo/ui';

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: Props) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4 shadow-sm', className)}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">{icon}</div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 font-semibold text-card-foreground">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
