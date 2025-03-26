'use server';

import { cookies, headers as nextHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import configs from 'src/configs';
import { ServiceError } from 'src/service';

// ----------

export async function auth<T>(result: Promise<T>): Promise<T> {
  try {
    return await result;
  } catch (error) {
    if (error instanceof ServiceError && error.statusCode === 401) {
      return redirectToSignIn();
    }

    throw error;
  }
}

export async function getAuthUserId() {
  try {
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get('accessToken')!;
    const result = jwt.decode(accessToken.value) as { userId: string };

    const { userId } = result;
    if (!userId) throw Error();

    return userId;
  } catch {
    return redirectToSignIn();
  }
}

// ----- HELPERS -----

async function redirectToSignIn(): Promise<never> {
  const headers = await nextHeaders();
  const clientCurrentUrl = headers.get('x-url') || '';
  redirect(`${configs.routes.signIn}?${new URLSearchParams({ url: clientCurrentUrl })}`);
}
