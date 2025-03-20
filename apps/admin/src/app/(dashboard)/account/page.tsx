'use client';

import { redirect } from 'next/navigation';
import { useAuth } from 'src/guards';

export default function Page() {
  const auth = useAuth();
  redirect(`/account/${auth.id}`);
}

export const dynamic = 'force-dynamic';
