import { PageLayout } from "@/components/PageLayout";

export default function Home() {
	return (
		<PageLayout>
			<section className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-contain bg-center bg-[#171923] pt-[64px]">
				<div className="container px-4 md:px-6 text-center space-y-6 flex flex-col items-center justify-center">
					<h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
						Hi! I'm Nicholas Griffin!
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-[700px]">
						I'm currently rebuilding my website after a bit of a break, please
						bare with.
					</p>
				</div>
			</section>
		</PageLayout>
	);
}
