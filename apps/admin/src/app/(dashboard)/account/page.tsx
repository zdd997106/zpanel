import { EPermission } from '@zpanel/core/enum';
import { Container } from '@mui/material';

import { api } from 'src/service';
import configs from 'src/configs';
import { auth, getAuthUserId, PermissionGuard } from 'src/guards';
import { PageHead } from 'src/components';
import AccountView from 'src/views/account/AccountView';

// ----------

async function Page() {
  const userId = await getAuthUserId();
  const user = await auth(api.getUserDetail(userId));

  return (
    <Container maxWidth="lg" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
      <PageHead
        title={metadata.title}
        breadcrumbs={[{ label: 'Dashboard', href: configs.routes.dashboard }, { label: 'Account' }]}
        marginBottom={{ xs: 3, md: 6 }}
      />

      <AccountView user={user} />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.ACCOUNT);

export const metadata = {
  title: 'Account Setting',
};

export const dynamic = 'force-dynamic';
