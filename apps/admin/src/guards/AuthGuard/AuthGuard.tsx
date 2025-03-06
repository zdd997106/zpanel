'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import configs from 'src/configs';
import { api } from 'src/service';
import { ServiceEvent } from 'src/utils';
import CommonPage from 'src/components/CommonPage';

import { useRouter } from 'next/navigation';
import { Box, LinearProgress } from '@mui/material';
import { AuthGuardContext } from './AuthGuardContext';

// ----------

export interface AuthGuardProps {
  children?: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const calledRef = useRef(false);

  const authUser = useQuery({
    queryFn: api.getAuthUser,
    queryKey: [api.getAuthUser.getPath()],
  });

  const authenticated = authUser.isFetchedAfterMount && !!authUser.data;

  useEffect(() => {
    if (calledRef.current) return;

    calledRef.current = true;
    authUser.refetch();
  }, []);

  useEffect(() => {
    return ServiceEvent.createRequestUnauthenticatedEvent().createListener(() => {
      router.push(`${configs.routes.signIn}?${new URLSearchParams({ url: window.location.href })}`);
    });
  }, []);

  if (authUser.error?.message) {
    return <CommonPage.Error fullScreen message={authUser.error?.message} />;
  }

  return (
    <AuthGuardContext.Provider value={authUser.data!}>
      {authenticated ? (
        children
      ) : (
        <Box position="fixed" top={0} left={0} zIndex={(theme) => theme.zIndex.appBar + 1}>
          <LinearProgress color="primary" />
        </Box>
      )}
    </AuthGuardContext.Provider>
  );
}
