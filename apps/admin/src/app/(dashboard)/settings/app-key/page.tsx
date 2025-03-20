'use client';

import { redirect } from 'next/navigation';
import configs from 'src/configs';
import { useAuth } from 'src/guards';

export default function Page() {
  const auth = useAuth();
  redirect(`${configs.routes.userApiKey}/${auth.id}`);
}

export const dynamic = 'force-dynamic';
