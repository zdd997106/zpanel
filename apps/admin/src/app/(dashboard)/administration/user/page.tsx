import { Container } from '@mui/material';
import { AuthGuard } from 'src/guards';
import UserView from 'src/views/administration/UserView';

export default function Page() {
  return (
    <AuthGuard>
      <Container>
        <UserView />
      </Container>
    </AuthGuard>
  );
}
