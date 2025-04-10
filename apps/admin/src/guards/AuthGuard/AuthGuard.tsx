'use client';

import { ServiceEvent } from '@zpanel/ui/service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Fade, Stack } from '@mui/material';

import configs from 'src/configs';
import { query, ServiceError } from 'src/service';
import { Logo } from 'src/components';
import CommonPage from 'src/components/CommonPage';

import { AuthGuardContext } from './AuthGuardContext';

// ----------

export default function AuthGuard({ children }: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const [expand, setExpand] = useState(false);
  const [authUser, authUserResult] = query.useAuthUser(true);
  const [, permissionKeysResult] = query.usePermissionKeys(true);

  // --- FUNCTIONS ---

  const isReady = () => !!authUserResult.data && !!permissionKeysResult.data;

  const isUnauthenticated = () => {
    return authUserResult.error instanceof ServiceError && authUserResult.error.statusCode === 401;
  };

  // --- EFFECTS ---

  useEffect(() => {
    if (!expand) setExpand(true);
  }, []);

  // Redirect to sign-in page if unauthenticated
  useEffect(() => {
    return ServiceEvent.createRequestUnauthenticatedEvent().createListener(() => {
      const currentUrl = window.location.href
        .replace(window.location.origin, '') // Remove the origin ({http(s)}://{domain})
        .replace(/^\/$/, ''); // Ensure the URL is not just a slash
      router.push(`${configs.routes.signIn}?${new URLSearchParams({ url: currentUrl })}`);
    });
  }, []);

  // --- ELEMENT SECTIONS ----

  const sections = {
    loading: (
      <Stack height="100dvh" width="100dvw" justifyContent="center" alignItems="center">
        <Fade in>
          <Logo expand={expand} sx={{ fontSize: { xs: 120, md: 160 }, fontWeight: 700 }} />
        </Fade>
      </Stack>
    ),
    error: (
      <Stack height="100dvh" width="100dvw" justifyContent="center" alignItems="center">
        <CommonPage.Error message={authUserResult.error?.message} />
      </Stack>
    ),
  };

  if (isUnauthenticated()) return sections.loading;

  if (authUserResult.error) return sections.error;

  if (!isReady()) return sections.loading;

  return <AuthGuardContext.Provider value={authUser!}>{children}</AuthGuardContext.Provider>;
}
