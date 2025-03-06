'use server';

import { headers as nextHeaders } from 'next/headers';
import { redirect } from 'next/navigation';

import configs from 'src/configs';
import { ServiceError } from 'src/service';

// ----------

export async function auth<T>(result: Promise<T>): Promise<T> {
  try {
    return await result;
  } catch (error) {
    if (error instanceof ServiceError && error.statusCode === 401) {
      const headers = await nextHeaders();
      const clientCurrentUrl = headers.get('x-url') || '';
      redirect(`${configs.routes.signIn}?${new URLSearchParams({ url: clientCurrentUrl })}`);
    }

    throw error;
  }
}
