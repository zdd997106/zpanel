import { Stack, Typography } from '@mui/material';
import Icons from 'src/icons';

// ----------

interface PageForbiddenProps {}

export default function PageForbidden(_props: PageForbiddenProps) {
  return (
    <Stack
      direction="column"
      spacing={3}
      alignItems="center"
      justifyContent="center"
      margin="auto"
      sx={{ paddingY: { xs: 3, md: 10 } }}
    >
      <Icons.AnimatedAlertBell sx={{ height: 'min(50vw, 200px)', width: 'min(50vw, 200px)' }} />

      <Stack spacing={1} sx={{ textAlign: 'center', paddingX: 2 }}>
        <Typography variant="h2" component="h1">
          Forbidden
        </Typography>

        <Typography
          variant="body2"
          color="action.active"
        >{`You don't have permission to access this resource.`}</Typography>
      </Stack>
    </Stack>
  );
}
