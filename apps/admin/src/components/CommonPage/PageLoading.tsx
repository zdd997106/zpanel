'use client';

import { Stack } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

export default function PageLoading() {
  return (
    <Stack
      height="100%"
      position="absolute"
      top={0}
      left={0}
      justifyContent="center"
      alignItems="center"
      color="primary.main"
      sx={{ height: '100%', width: '100%' }}
    >
      <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 'min(50vw, 360px)' }} />
    </Stack>
  );
}
