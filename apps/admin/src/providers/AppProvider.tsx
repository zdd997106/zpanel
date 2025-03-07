'use client';

import { Fade, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Logo } from 'src/components';
import { query } from 'src/service';

export default function AppProvider({ children }: React.PropsWithChildren<{}>) {
  const [, authUserResult] = query.useAuthUser(true);
  const [, permissionKeysResult] = query.usePermissionKeys(true);
  const [expand, setExpand] = useState(false);

  // --- FUNCTIONS ---

  const isReady = () => authUserResult.isFetched && permissionKeysResult.isFetched;

  // --- EFFECTS ---

  useEffect(() => {
    if (!expand) setExpand(true);
  }, []);

  if (isReady()) return children;

  return (
    <Stack height="100dvh" width="100dvw" justifyContent="center" alignItems="center">
      <Fade in>
        <Logo expand={expand} sx={{ fontSize: { xs: 120, md: 160 }, fontWeight: 700 }} />
      </Fade>
    </Stack>
  );
}
