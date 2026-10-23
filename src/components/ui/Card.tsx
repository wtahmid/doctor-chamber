// Reusable card wrapper with a consistent shadow, border, and radius.

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  const cls = [
    'bg-white rounded-xl border border-slate-200 shadow-sm',
    hover ? 'transition-shadow hover:shadow-md' : '',
    className,
  ].join(' ');

  return <div className={cls}>{children}</div>;
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={'rounded-t-xl border-b border-slate-200 bg-slate-50/70 px-5 py-4 ' + className}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={'p-5 ' + className}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={'text-lg font-semibold text-slate-800 ' + className}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={'text-sm text-slate-500 ' + className}>{children}</p>;
}
