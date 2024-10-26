import NextLink from "next/link";
import { clsx } from 'clsx';

export function Link({
  href,
  children,
  underline = true,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  underline?: boolean;
  [key: string]: unknown;
}) {
  return (
    <NextLink
      href={href}
      className={clsx(
        'text-[#fff] inline font-bold p-0 transition-colors hover:underline hover:outline-none decoration-1 decoration-skip-ink-none underline-offset-[0.25em] hover:decoration-2',
        {
          underline: underline,
        }
      )}
      prefetch={false}
      {...props}
    >
      {children}
    </NextLink>
  );
}
