import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
	return (
		<main>
			<section className="w-full min-h-screen flex flex-col items-center justify-center bg-[url('/images/placeholder.svg')] bg-contain bg-center">
				<div className="container px-4 md:px-6 text-center space-y-6 flex flex-col items-center justify-center">
						<Avatar className="w-16 h-16">
							<AvatarImage src="/avatar.png" />
							<AvatarFallback>Avatar</AvatarFallback>
						</Avatar>
					<h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
							Hi! I'm Nicholas Griffin!
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-[700px]">
							I'm currently rebuilding my website after a bit of a break, please
							bare with.
					</p>
				</div>
			</section>
		</main>
	);
}
