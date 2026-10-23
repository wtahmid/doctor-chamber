// Reusable button primitives.
//
// Variants: primary (blue), secondary (outline), ghost (link-like),
// destructive (red), and white (for dark backgrounds). Sizes: sm, md, lg.

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, Ref } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'white';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400',
  ghost:
    'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
  white: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-5 py-3 text-base rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className = '', children, ...rest }: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const classes = [
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ');

    return <button ref={ref} className={classes} {...rest} />;
  }
);
Button.displayName = 'Button';
