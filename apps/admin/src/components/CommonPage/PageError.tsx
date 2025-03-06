import { Stack, Typography } from '@mui/material';
import Icons from 'src/icons';

// ----------

interface PageErrorProps {
  message?: React.ReactNode;
  fullScreen?: boolean;
}

export default function PageError({ message, fullScreen = false }: PageErrorProps) {
  return (
    <Stack
      direction="column"
      spacing={3}
      alignItems="center"
      justifyContent="center"
      sx={{ paddingY: { xs: 3, md: 10 }, minHeight: fullScreen ? '100dvh' : '100%' }}
    >
      <Icons.AnimatedGear sx={{ height: 'min(50vw, 200px)', width: 'min(50vw, 200px)' }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h1">
          {message || 'Something Went Wrong'}
        </Typography>
      </Stack>
    </Stack>
  );
}
