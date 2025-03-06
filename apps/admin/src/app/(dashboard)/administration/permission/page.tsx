import { Container } from '@mui/material';
import { EPermission } from '@zpanel/core';

import { auth, PermissionGuard } from 'src/guards';
import { api } from 'src/service';
import PermissionView from 'src/views/administration/PermissionView';

async function Page() {
  const permissions = await auth(api.getAllPermissions());

  return (
    <Container maxWidth="xl" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
      <PermissionView permissions={permissions} />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.PERMISSION_CONFIGURE);
