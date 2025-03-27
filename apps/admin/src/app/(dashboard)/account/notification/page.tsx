import { FindUserNotificationsDto } from '@zpanel/core';
import { EPermission } from '@zpanel/core/enum';
import { Container } from '@mui/material';

import { api } from 'src/service';
import configs from 'src/configs';
import { auth, getAuthUserId, PermissionGuard } from 'src/guards';
import { PageHead } from 'src/components';
import NotificationView from 'src/views/account/NotificationView';

// ----------

interface PageProps {
  searchParams: Promise<{ page: number; limit: number }>;
}

async function Page({ searchParams }: PageProps) {
  const id = await getAuthUserId();
  const query = FindUserNotificationsDto.schema.parse(await searchParams);

  const { items: notifications, count } = await auth(api.getUserNotifications(id, query));

  return (
    <Container maxWidth="sm" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
      <PageHead
        title={metadata.title}
        breadcrumbs={[
          { label: 'Dashboard', href: configs.routes.dashboard },
          { label: 'Notification' },
        ]}
        marginBottom={{ xs: 3, md: 6 }}
      />

      <NotificationView
        notifications={notifications}
        paginationProps={{ page: query.page, count: Math.ceil(count / query.limit) || 1 }}
      />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.NOTIFICATION);

export const metadata = {
  title: 'Notification',
};

export const dynamic = 'force-dynamic';
