import NextLink from "next/link";

export function Link({
	href,
	children,
	...props
}: {
	href: string;
	children: React.ReactNode;
	[key: string]: unknown;
}) {
	return (
    <NextLink
      href={href}
      className="font-medium text-primary-foreground hover:underline transition-colors"
      prefetch={false}
      {...props}
    >
      {children}
    </NextLink>
  );
}
