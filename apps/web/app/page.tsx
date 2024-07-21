import { PageLayout } from "@/components/PageLayout";
import "./home.css";

export default function Home() {
	return (
		<PageLayout>
			<section className="relative overflow-hidden w-full min-h-[80vh] flex flex-col items-center justify-center bg-contain bg-center bg-[#010517] bg-gradient-to-r from-[#010517] to-[#030825] pt-[64px]">
				<div className="absolute bottom-0 w-full h-full">
					<div className="stars stars1" />
					<div className="stars stars2" />
					<div className="stars stars3" />
				</div>
				<div className="z-10 container px-4 md:px-6 text-center space-y-6 flex flex-col items-center justify-center">
					<h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
						Hi! I'm Nicholas Griffin!
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-[450px]">
						I'm currently rebuilding my website after a bit of a break, please
						bare with.
					</p>
				</div>
			</section>
		</PageLayout>
	);
}
