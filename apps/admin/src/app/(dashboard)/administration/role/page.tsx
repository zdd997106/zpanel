import { EPermission } from '@zpanel/core/enum';
import { Container } from '@mui/material';

import { api } from 'src/service';
import configs from 'src/configs';
import { auth, PermissionGuard } from 'src/guards';
import { PageHead } from 'src/components';
import RoleListView from 'src/views/administration/RoleListView';

// ----------

async function Page() {
  const roles = await auth(api.getAllRoles());
  const permissions = await auth(api.getAllPermissions());

  return (
    <Container maxWidth="lg" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
      <PageHead
        title={metadata.title}
        breadcrumbs={[
          { label: 'Dashboard', href: configs.routes.dashboard },
          { label: 'Configuration' },
          { label: 'Role' },
        ]}
        marginBottom={{ xs: 3, md: -3.5 }}
      />

      <RoleListView roles={roles} permissions={permissions} />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.ROLE_CONFIGURE);

export const metadata = {
  title: 'Role Management',
};

export const dynamic = 'force-dynamic';
