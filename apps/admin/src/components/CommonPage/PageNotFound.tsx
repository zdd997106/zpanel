'use client';

import { Link, Stack, Typography } from '@mui/material';
import Icons from 'src/icons';

// ----------

interface PageNotFoundProps {}

export default function PageNotFound(_props: PageNotFoundProps) {
  return (
    <Stack
      direction="column"
      spacing={3}
      alignItems="center"
      justifyContent="center"
      margin="auto"
      sx={{ paddingY: { xs: 3, md: 10 } }}
    >
      <Icons.AnimatedGotLost sx={{ height: 'min(50vw, 200px)', width: 'min(50vw, 200px)' }} />

      <Stack spacing={1} sx={{ textAlign: 'center', paddingX: 2 }}>
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
