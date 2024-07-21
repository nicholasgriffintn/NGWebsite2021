import "./home.css";

import { PageLayout } from "@/components/PageLayout";
import { Hero } from "@/components/Heros/Homepage";

export default function Home() {
	return (
		<PageLayout>
			<Hero />
			<section className="min-h-[80vh] container px-4 md:px-6 py-12 text-center">
				<p>I'm currently working on rebuilding this site, please bare with, it's still a work in progress.</p>
			</section>
		</PageLayout>
	);
}
