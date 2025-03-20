import { EPermission } from '@zpanel/core/enum';
import { Container } from '@mui/material';

import { api } from 'src/service';
import configs from 'src/configs';
import { auth, PermissionGuard } from 'src/guards';
import { PageHead } from 'src/components';
import AppKeyView from 'src/views/account/AppKeyView';

// ----------

interface PageProps {
  params: Promise<{ id: string }>;
}

async function Page({ params }: PageProps) {
  const { id } = await params;
  const appKeys = await auth(api.getUserAppKeys(id));

  return (
    <Container maxWidth="lg" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
      <PageHead
        title={metadata.title}
        breadcrumbs={[
          { label: 'Dashboard', href: configs.routes.dashboard },
          { label: 'Setting' },
          { label: 'App Key' },
        ]}
        marginBottom={{ xs: 3, md: -3.5 }}
      />

      <AppKeyView appKeys={appKeys} showLess />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.APP_KEY_MANAGEMENT);

export const metadata = {
  title: 'Management Your App Keys',
};

export const dynamic = 'force-dynamic';
