import { Container } from '@mui/material';
import { AuthGuard } from 'src/guards';
import PermissionView from 'src/views/administration/PermissionView';

export default function Page() {
  return (
    <AuthGuard>
      <Container maxWidth="xl" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
        <PermissionView />
      </Container>
    </AuthGuard>
  );
}
