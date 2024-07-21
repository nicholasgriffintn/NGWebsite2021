import { Link } from "@/components/Link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Footer() {
	return (
		<footer className="w-full">
			<div className="container flex items-center items-center justify-center py-4 gap-4">
				<div className="flex items-center space-x-4 py-2">
					<Avatar>
						<AvatarImage src="/avatar.png" />
						<AvatarFallback>NG</AvatarFallback>
					</Avatar>
				</div>
				<div>
					<span>Copyright © {new Date().getFullYear()} Nicholas Griffin</span>
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
