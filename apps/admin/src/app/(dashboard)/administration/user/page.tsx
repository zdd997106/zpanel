import { Container } from '@mui/material';
import { EPermission } from '@zpanel/core';
import PageHead from 'src/components/PageHead';
import configs from 'src/configs';

import { PermissionGuard } from 'src/guards';
import { api } from 'src/service';
import UserView from 'src/views/administration/UserView';

async function Page() {
  const users = await api.getAllUsers();

  return (
    <Container>
      <PageHead
        title={metadata.title}
        breadcrumbs={[{ label: 'Dashboard', href: configs.routes.dashboard }, { label: 'User' }]}
        marginBottom={{ xs: 3, md: 6 }}
      />

      <UserView users={users} />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.USER_CONFIGURE);

export const metadata = {
  title: 'User Management',
};
