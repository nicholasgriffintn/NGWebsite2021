import { ChevronUp } from 'lucide-react';

import { getRecentlyPlayed } from '@/lib/data/spotify';
import { getProjects } from '@/lib/data/projects';
import { getGitHubRepos } from '@/lib/data/github';
import { PageLayout } from '@/components/PageLayout';
import { SpotifyWidget } from '@/components/SpotifyWidget';
import { ContactLinks } from '@/components/ContactLinks';
import { InnerPage } from '@/components/InnerPage';
import { ProjectsList } from '@/components/ProjectsList';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/components/Link';
import { getBlogPosts } from '@/lib/blog';
import { BlogCard } from '@/components/BlogCard';

export const revalidate = 60;

export const metadata = {
  title: 'Home',
  description: 'THe personal website of Nicholas Griffin',
};

async function getData() {
  const spotify = await getRecentlyPlayed();
  const projects = await getProjects();
  const featuredRepos = await getGitHubRepos({ limit: 8, offset: 1 });
  const blogPosts = await getBlogPosts();
  const firstSixPosts = blogPosts.slice(0, 6);

  return {
    spotify,
    projects,
    featuredRepos,
    blogPosts: firstSixPosts,
  };
}

export default async function Home() {
  const data = await getData();

  const firstFeaturedProjects = data?.projects?.slice(0, 3);
  const lastFeaturedProjects = data?.projects?.slice(3);

  return (
    <PageLayout>
      <InnerPage>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
            <div className="text-primary-foreground lg:max-w-[75%]">
              <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground lg:pt-5">
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
          <div className="col-span-5 md:col-span-2 lg:col-span-1 pt-10 lg:pt-5">
            <div>
              <SpotifyWidget data={data?.spotify} />
              <div className="text-sm text-muted-foreground text-center inline-flex justify-center w-full mt-5">
                <span>What I&apos;m listening to</span>
                <ChevronUp />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-break-out pt-5 mt-20 relative">
          <div className="bg-[#171923] w-full min-h-[240px] absolute top-0 left-0" />
          <div className="container relative">
            <div className="text-center pb-5">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground md:pt-5">
                What's going on?
              </h2>
              <p>
                Below you will find some of the blog posts that I have wrote (if
                that is still working), I used to write a lot and I'm looking to
                write blog posts more about the projects that I am working on.
                There might not be a lot here but I hope that it will at least
                be interesting, at least to me.
              </p>
            </div>
            <section>
              {data?.blogPosts && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {data.blogPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
              <div className="w-full flex justify-center pt-5">
                <Link
                  href="/blog"
                  className={buttonVariants({ variant: 'default', size: 'lg' })}
                  underline={false}
                >
                  View all of my blog posts
                </Link>
              </div>
            </section>
            <div className="text-center pb-5">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground md:pt-5">
                So what is it that you do? 🤔
              </h2>
              <p>
                Well quite a few things, here are some of my favourite projects
                alongside my most recently updated GitHub repos:
              </p>
            </div>
            <ProjectsList
              firstFeaturedProjects={firstFeaturedProjects}
              featuredRepos={data?.featuredRepos}
              lastFeaturedProjects={lastFeaturedProjects}
            />
          </div>
        </div>
      </InnerPage>
    </PageLayout>
  );
}
