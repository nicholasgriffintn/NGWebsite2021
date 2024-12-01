import { PageLayout } from '@/components/PageLayout';
import { InnerPage } from '@/components/InnerPage';
import { AnyoneCanDraw } from '@/components/AnyoneCanDraw';
import { validateToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { logIn } from '@/lib/auth';
import { LoginForm } from '@/components/ChatInterface/LoginForm';

export const metadata = {
  title: 'Anyone Can Draw',
  description:
    'A drawing app that uses AI to generate paintings from your drawings.',
};

export default async function AnyoneCanDrawHome() {
  const token = await validateToken();

  async function handleLogIn(formData: FormData) {
    'use server';
    const token = formData.get('token') as string;
    if (token) {
      await logIn(token);
      revalidatePath('/anyone-can-draw');
    }
  }

  if (!token) {
    return (
      <PageLayout>
        <InnerPage>
          <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
            Unauthorized
          </h1>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 md:col-span-3 lg:col-span-3 pt-5">
              <p className="text-red-600">
                Access denied. Please enter a valid token.
              </p>
              <LoginForm onSubmit={handleLogIn} />
            </div>
          </div>
        </InnerPage>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <InnerPage>
        <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
          Anyone Can Draw
        </h1>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
            <div className="text-primary-foreground lg:max-w-[75%]">
              <p>
                This is a drawing app that uses AI to generate paintings from
                your drawings.
              </p>
            </div>
          </div>
        </div>
        <AnyoneCanDraw />
      </InnerPage>
    </PageLayout>
  );
}
