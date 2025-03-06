'use client';

import { Link, Stack, Typography } from '@mui/material';
import Icons from 'src/icons';

// ----------

interface PageNotFoundProps {
  fullScreen?: boolean;
}

export default function PageNotFound({ fullScreen = false }: PageNotFoundProps) {
  return (
    <Stack
      direction="column"
      spacing={3}
      alignItems="center"
      justifyContent="center"
      sx={{ paddingY: { xs: 3, md: 10 }, minHeight: fullScreen ? '100dvh' : '100%' }}
    >
      <Icons.AnimatedGotLost sx={{ height: 'min(50vw, 200px)', width: 'min(50vw, 200px)' }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h2" component="h1">
          Not Found
        </Typography>

        <Typography variant="body2" color="action.active">
          Could not find resource you requested.
        </Typography>

        <Typography variant="body2">
          <Link href="/">Go back</Link>
        </Typography>
      </Stack>
    </Stack>
  );
}
