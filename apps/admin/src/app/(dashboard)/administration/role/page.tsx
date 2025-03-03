import { Container } from '@mui/material';
import { AuthGuard } from 'src/guards';
import RoleListView from 'src/views/administration/RoleListView';

export default function Page() {
  return (
    <AuthGuard>
      <Container maxWidth="lg" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
        <RoleListView />
      </Container>
    </AuthGuard>
  );
}
