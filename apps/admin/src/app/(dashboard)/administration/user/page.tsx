import { Container } from '@mui/material';
import { EPermission } from '@zpanel/core';

import { PermissionGuard } from 'src/guards';
import { api } from 'src/service';
import UserView from 'src/views/administration/UserView';

async function Page() {
  const users = await api.getAllUsers();

  return (
    <Container>
      <UserView users={users} />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.USER_CONFIGURE);
