import { getSession } from '@auth0/nextjs-auth0';

import { Link } from '@/components/Link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export async function Header() {
  const session = await getSession();

  return (
    <header className="fixed w-full z-50">
      <div className="w-full min-h-[3px] bg-gradient-to-r from-[#093054] to-[#061e35]" />
      <div className="bg-[#171923] shadow">
        <div className="container flex items-center justify-between">
          <div className="flex items-center space-x-4 py-2">
            <Link href="/">
              <Avatar>
                <AvatarImage
                  src="/avatar.png"
                  alt="Nicholas Griffin's initials as a logo"
                />
                <AvatarFallback>NG</AvatarFallback>
              </Avatar>
              <span className="sr-only">Home</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 hidden md:block">
            <Link href="/blog" underline={false}>
              Blog
            </Link>
            <Link href="/projects" underline={false}>
              Projects
            </Link>
            <Link href="/contact" underline={false}>
              Contact
            </Link>
            {!session?.user?.email ? (
              <Link href="/api/auth/login" underline={false}>
                Login
              </Link>
            ) : (
              <>
                <Avatar>
                  <AvatarImage
                    src={session.user.picture}
                    alt={`Profile picture of ${session.user.name}`}
                  />
                  <AvatarFallback>{session.user.nickname}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Home</span>
                <Link href="/api/auth/logout" underline={false}>
                  Logout
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
