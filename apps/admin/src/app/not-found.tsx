import { Stack } from '@mui/material';
import CommonPage from 'src/components/CommonPage';

export default function Page() {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100dvh', width: '100dvw' }}
    >
      <CommonPage.NotFound />
    </Stack>
  );
}
