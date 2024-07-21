import { ChevronDown } from "lucide-react";

import "./home.css";

import { getRecentlyPlayed } from "@/lib/data/spotify";
import { PageLayout } from "@/components/PageLayout";
import { Hero } from "@/components/Heros/Homepage";
import { SpotifyWidget } from "@/components/SpotifyWidget";

async function getData() {
	const spotify = await getRecentlyPlayed();

	return {
		spotify,
	};
}

export default async function Home() {
	const data = await getData();

	return (
		<PageLayout>
			<Hero />
			<section className="container px-4 md:px-6 py-12 text-left">
				<div className="grid grid-cols-5 gap-4">
					<div className="col-span-5 md:col-span-3 lg:col-span-4">
						<div className="text-primary-foreground lg:max-w-[75%]">
							<h2 className="text-2xl md:text-4xl font-bold text-primary-foreground">
								👋 Welcome to my website!
							</h2>
							<p>
								Thanks for visiting my site! As you might have read in the title,
								my name is Nicholas Griffin and I am a Senior Software Engineer,
								Blogger and Technology enthusiast from the UK.
							</p>
							<p>
								Feel free to scroll further down to find out more about me or my
								projects, I've also added my contact links below.
							</p>
							<h3 className="text-1xl md:text-2xl font-bold text-primary-foreground">About me</h3>
							<p>
								I would classify myself as a Full Stack Developer with a slight
								bias towards frontend. I spend most of my dev time doing a range
								of personal development projects around the web alongside my day
								job.
							</p>
							<p>
								Outside of development, I enjoy the odd read and love to listen to
								music, with an aim to find some good new stuff, however, that's
								mostly about trying to beat the algorithm.
							</p>
							<p>You can find out more about me and my projects below.</p>
						</div>
					</div>
					<div className="col-span-5 md:col-span-2 lg:col-span-1">
						<div>
							<SpotifyWidget data={data?.spotify} />
							<span id="MusicOpeningWrapperTitle">
								What I&apos;m listening to <ChevronDown />
							</span>
						</div>
					</div>
				</div>
				<p className="bg-[#555] mt-6 p-4">
					I'm currently working on rebuilding this site, please bare with, it's
					still a work in progress.
				</p>
			</section>
		</PageLayout>
	);
}
