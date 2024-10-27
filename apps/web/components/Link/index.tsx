import NextLink from "next/link";
import { clsx } from 'clsx';

export function Link({
  href,
  children,
  underline = true,
  className,
  muted = false,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  underline?: boolean;
  className?: string;
  muted?: boolean;
  [key: string]: unknown;
}) {
  return (
    <NextLink
      {...props}
      href={href}
      className={clsx(
        className,
        'inline font-bold p-0 transition-colors hover:underline hover:outline-none decoration-1 decoration-skip-ink-none underline-offset-[0.25em] hover:decoration-2',
        {
          underline: underline,
        },
        muted ? 'text-muted-foreground' : 'text-primary-foreground'
      )}
      prefetch={false}
    >
      {children}
    </NextLink>
  );
}
