import { PageLayout } from '@/components/PageLayout';
import { InnerPage } from '@/components/InnerPage';

// TODO: Add new blog list and functionality

export const metadata = {
  title: 'Blog',
  description: 'A collection of blog posts that I have written.',
};

export default async function Home() {
  return (
    <PageLayout>
      <InnerPage>
        <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
          Blog
        </h1>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
            <div className="text-primary-foreground lg:max-w-[75%]">
              <p>
                I've been running my own blogs since 2011, I started off with my
                own technology blog called TechNutty. I worked on that for just
                short of 7 years, during which time I also ran this personal
                site and have been updating it since.
              </p>
              <p>Check out my latest posts below.</p>
            </div>
          </div>
        </div>
        <p className="bg-[#555] mt-6 p-4">
          Sorry, I'm currently working on rebuilding the blog list for this
          page.
        </p>
      </InnerPage>
    </PageLayout>
  );
}
