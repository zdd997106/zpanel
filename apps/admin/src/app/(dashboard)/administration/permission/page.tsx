import { EPermission } from '@zpanel/core/enum';
import { Container } from '@mui/material';

import configs from 'src/configs';
import { api } from 'src/service';
import { auth, PermissionGuard } from 'src/guards';
import { PageHead } from 'src/components';
import PermissionView from 'src/views/administration/PermissionView';

// ----------

async function Page() {
  const permissions = await auth(api.getAllPermissions());

  return (
    <Container maxWidth="xl" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
      <PageHead
        title={metadata.title}
        breadcrumbs={[
          { label: 'Dashboard', href: configs.routes.dashboard },
          { label: 'Configuration' },
          { label: 'Permission' },
        ]}
        marginBottom={{ xs: 3, md: -3.5 }}
      />

      <PermissionView permissions={permissions} />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.PERMISSION_CONFIGURE);

export const metadata = {
  title: 'Permission Management',
};

export const dynamic = 'force-dynamic';
