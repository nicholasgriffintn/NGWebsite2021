import { PageLayout } from '@/components/PageLayout';
import { ContactLinks } from '@/components/ContactLinks';
import { Link } from '@/components/Link';
import { InnerPage } from '@/components/InnerPage';

// TODO: Add form: https://github.com/nicholasgriffintn/NGWebsite2021/blob/16930e6c23a6a57a2ff61c1f802bcdd2c35aced4/src/pages/contact.js

export const metadata = {
  title: 'Contact',
  description: 'Send me a message.',
};

export default async function Home() {
  return (
    <PageLayout>
      <InnerPage>
        <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
          Send me a message
        </h1>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
            <div className="text-primary-foreground lg:max-w-[75%]">
              <p>I'm looking forward to hearing from you!</p>
              <p>
                Please fill in the form below to send me a message,
                alternatively, you can send me a message via one of the social
                networks below.
              </p>
              <p>
                If you are a recruiter then please head on over to LinkedIn
                instead where you may be ignored, unless you have a really
                interesting thing for me 🥸.
              </p>
              <ContactLinks />
            </div>
          </div>
        </div>
        <p className="bg-[#555] mt-6 p-4">
          Sorry, I'm currently working on rebuilding the form for this page,
          while you wait, you can instead send me a message at{' '}
          <Link href="mailto:me@nickgriffin.uk">me@nickgriffin.uk</Link>
        </p>
      </InnerPage>
    </PageLayout>
  );
}
