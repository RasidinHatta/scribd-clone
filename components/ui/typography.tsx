import { ComponentPropsWithoutRef } from 'react';

interface TypographyH2Props extends ComponentPropsWithoutRef<'h2'> {
  children: React.ReactNode;
}

export function TypographyH2({ children, className, ...props }: TypographyH2Props) {
  return (
    <h2 
      className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className || ''}`}
      {...props}
    >
      {children}
    </h2>
  );
}

interface TypographyPProps extends ComponentPropsWithoutRef<'p'> {
  children: React.ReactNode;
}

export function TypographyP({ children, className, ...props }: TypographyPProps) {
  return (
    <p 
      className={`leading-7 [&:not(:first-child)]:mt-6 ${className || ''}`}
      {...props}
    >
      {children}
    </p>
  );
}