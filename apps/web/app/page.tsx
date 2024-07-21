import { PageLayout } from "@/components/PageLayout";
import "./home.css";

export default function Home() {
	return (
		<PageLayout>
			<section className="relative overflow-hidden w-full min-h-[80vh] flex flex-col items-center justify-center bg-contain bg-center bg-[#010517] bg-gradient-to-r from-[#010517] to-[#030825] pt-[64px]">
				<div className="w-full h-hull">
					<div className="stars" />
					<div className="stars1" />
					<div className="stars2" />
				</div>
				<div className="z-10 container px-4 md:px-6 text-center space-y-6 flex flex-col items-center justify-center">
					<h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
						Hi! I'm Nicholas Griffin!
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-[640px]">
						I'm a Senior Software Engineer, based in London. I work on a whole range of side projects, some of which will be completed some won't. Other than that, I'm working on cool new stuff at the BBC.
					</p>
				</div>
			</section>
		</PageLayout>
	);
}
