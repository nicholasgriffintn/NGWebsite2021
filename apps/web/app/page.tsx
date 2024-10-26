import { ChevronDown } from "lucide-react";

import { getRecentlyPlayed } from '@/lib/data/spotify';
import { getProjects } from '../lib/data/projects';
import { getGitHubRepos } from '@/lib/data/github';
import { PageLayout } from '@/components/PageLayout';
import { SpotifyWidget } from '@/components/SpotifyWidget';
import { ContactLinks } from '@/components/ContactLinks';
import { InnerPage } from '@/components/InnerPage';

export const revalidate = 60;

async function getData() {
  const spotify = await getRecentlyPlayed();
  const projects = await getProjects();
  const repos = await getGitHubRepos({ limit: 8, offset: 1 });

  return {
    spotify,
    projects,
    repos,
  };
}

export default async function Home() {
  const data = await getData();

  return (
    <PageLayout>
      <InnerPage>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
            <div className="text-primary-foreground lg:max-w-[75%]">
              <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground md:pt-5">
                👋 Welcome to my website!
              </h1>
              <p>
                Thanks for visiting my site! My name is Nicholas Griffin and I
                am a Senior Software Engineer from the UK.
              </p>
              <h2 className="text-1xl md:text-2xl font-bold text-primary-foreground">
                About me
              </h2>
              <p>
                I would classify myself as a Full Stack Developer with a slight
                bias towards frontend. I spend most of my dev time doing a range
                of personal development projects around the web alongside my day
                job at the BBC.
              </p>
              <p>
                Outside of development, I enjoy the odd read and love to listen
                to music, with an aim to find some good new stuff, however,
                that's mostly about trying to beat the algorithm.
              </p>
              <p>You can find out more about me and my projects below.</p>
              <ContactLinks />
            </div>
          </div>
          <div className="col-span-5 md:col-span-2 lg:col-span-1 pt-5">
            <div>
              <SpotifyWidget data={data?.spotify} />
              <span id="MusicOpeningWrapperTitle">
                What I&apos;m listening to <ChevronDown />
              </span>
            </div>
          </div>
        </div>
      </InnerPage>
    </PageLayout>
  );
}
