import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function validateToken() {
  const systemAuthToken = process.env.AUTH_TOKEN || '';
  if (!systemAuthToken) return null;

  const cookieStore = await cookies();
  const userAuthToken = cookieStore.get('authToken');
  return userAuthToken?.value === systemAuthToken ? userAuthToken.value : null;
}

export async function handleLogin(formData: FormData) {
  'use server';

  console.log('formData', formData);

  const token = formData.get('token') as string;
  if (!token) {
    return { error: 'Token is required' };
  }
  const redirectUrl = formData.get('redirectUrl') as string | '/';
  if (!redirectUrl) {
    return { error: 'Redirect URL is required' };
  }

  const systemAuthToken = process.env.AUTH_TOKEN || '';
  if (token !== systemAuthToken) {
    return { error: 'Invalid token' };
  }

  const cookieStore = await cookies();

  cookieStore.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });

  revalidatePath(redirectUrl);
}
