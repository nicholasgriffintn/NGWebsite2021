import { PageLayout } from '@/components/PageLayout';
import { ContactLinks } from '@/components/ContactLinks';
import { Link } from '@/components/Link';

export default async function Home() {
  return (
    <PageLayout>
      <section className="container px-4 md:px-6 pt-20 text-left">
        <div className="pt-20"></div>
        <div className="grid grid-cols-5 gap-4 h-full">
          <div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
            <div className="text-primary-foreground lg:max-w-[75%]">
              <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
                Hey! I see that you have come for my old site TechNutty.
              </h1>
              <p>
                Sorry to say but I decided that I would stop my management of
                that site back in 2018, I am now focusing on web development and
                other interesting projects.
              </p>
              <p>
                Check out my <Link href="/">home page</Link> instead?
              </p>
            </div>
          </div>
        </div>
        <div className="pt-20"></div>
      </section>
    </PageLayout>
  );
}
