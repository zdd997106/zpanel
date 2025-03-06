import { Container } from '@mui/material';

import { api } from 'src/service';
import UserView from 'src/views/administration/UserView';

export default async function Page() {
  const users = await api.getAllUsers();

  return (
    <Container>
      <UserView users={users} />
    </Container>
  );
}
