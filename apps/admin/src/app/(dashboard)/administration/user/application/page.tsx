import { EPermission } from '@zpanel/core/enum';
import { Container } from '@mui/material';

import configs from 'src/configs';
import { api } from 'src/service';
import { auth, PermissionGuard } from 'src/guards';
import { PageHead } from 'src/components';
import ApplicationView from 'src/views/administration/ApplicationView';

// ----------

async function Page() {
  const applications = await auth(api.getAllApplications());

  return (
    <Container>
      <PageHead
        title={metadata.title}
        breadcrumbs={[
          { label: 'Dashboard', href: configs.routes.dashboard },
          { label: 'User', href: configs.routes.userManagement },
          { label: 'Application' },
        ]}
        marginBottom={{ xs: 3, md: 6 }}
      />

      <ApplicationView applications={applications} />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.APPLICATION_CONFIGURE);

export const metadata = {
  title: 'Application Management',
};

export const dynamic = 'force-dynamic';
