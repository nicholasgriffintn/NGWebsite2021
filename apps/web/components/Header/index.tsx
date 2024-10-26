import { Link } from "@/components/Link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
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
          <nav className="flex items-center space-x-6">
            <Link href="/setup" underline={false}>
              Setup
            </Link>
            <Link href="/contact" underline={false}>
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
