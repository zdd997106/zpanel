import { EPermission } from '@zpanel/core/enum';
import { Container } from '@mui/material';

import { api } from 'src/service';
import configs from 'src/configs';
import { auth, PermissionGuard } from 'src/guards';
import { PageHead } from 'src/components';
import AppKeyView from 'src/views/administration/AppKeyView';

// ----------

async function Page() {
  const appKeys = await auth(api.getAllAppKeys());

  return (
    <Container maxWidth="lg" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
      <PageHead
        title={metadata.title}
        breadcrumbs={[
          { label: 'Dashboard', href: configs.routes.dashboard },
          { label: 'Configuration' },
          { label: 'Outsource Access' },
        ]}
        marginBottom={{ xs: 3, md: -3.5 }}
      />

      <AppKeyView appKeys={appKeys} />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.APP_KEY_CONFIGURE);

export const metadata = {
  title: 'Outsource Access Management',
};

export const dynamic = 'force-dynamic';
