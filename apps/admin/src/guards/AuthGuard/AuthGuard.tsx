'use client';

import { query } from 'src/service';

import { AuthGuardProvider } from './AuthGuardProvider';
// ----------

export interface AuthGuardProps {
  children?: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [authUser] = query.useAuthUser(false);

  if (!authUser) return null;
  return <AuthGuardProvider value={authUser}>{children}</AuthGuardProvider>;
}
