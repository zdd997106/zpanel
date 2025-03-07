'use server';

import { api } from 'src/service';

import { AuthGuardProvider } from './AuthGuardProvider';
import { auth } from './utils';
// ----------

export interface AuthGuardProps {
  children?: React.ReactNode;
}

export default async function AuthGuard({ children }: AuthGuardProps) {
  const authUser = await auth(api.getAuthUser());
  return <AuthGuardProvider value={authUser}>{children}</AuthGuardProvider>;
}
