import { Link } from "@/components/Link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Footer() {
	return (
    <footer className="w-full">
      <div className="container flex items-center items-center justify-center py-4 gap-4">
        <div className="flex items-center space-x-4 py-2">
          <Avatar>
            <AvatarImage
              src="/avatar.png"
              alt="Nicholas Griffin's initials as a logo"
            />
            <AvatarFallback>NG</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <span>
            © {new Date().getFullYear()} Nicholas Griffin.{' '}
            <Link
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-SA 4.0
            </Link>
          </span>
        </div>
        <div>
          <nav className="flex items-center space-x-6">
            <Link
              href="https://github.com/nicholasgriffintn/NGWebsite2021"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source Code
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
