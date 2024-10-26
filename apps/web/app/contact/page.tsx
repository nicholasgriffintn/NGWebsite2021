import { PageLayout } from '@/components/PageLayout';
import { ContactLinks } from '@/components/ContactLinks';

export default async function Home() {
  return (
    <PageLayout>
      <section className="container px-4 md:px-6 pt-20 text-left">
        <div className="pt-20"></div>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
            <div className="text-primary-foreground lg:max-w-[75%]">
              <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground">
                Send me a message
              </h2>
              <p>
                I'm looking forward to hearing from you (as long as you're not a
                spammer 😅)!
              </p>
              <p>
                Please fill in the form below to send me a message,
                alternatively, you can send me a message via one of the social
                networks below.
              </p>
              <p>
                If you are a recruiter then please head on over to LinkedIn
                instead where you may be ignored 🥸.
              </p>
              <ContactLinks />
            </div>
          </div>
        </div>
        <p className="bg-[#555] mt-6 p-4">
          Sorry, I'm currently working on rebuilding the form for this page,
          while you wait, you can instead send me a message at{' '}
          <a href="mailto:me@nickgriffin.uk">me@nickgriffin.uk</a>
        </p>
        <div className="pt-20"></div>
      </section>
    </PageLayout>
  );
}
