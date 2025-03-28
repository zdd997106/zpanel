import { EPermission } from '@zpanel/core/enum';
import { Container } from '@mui/material';
import { FindAllNotificationsDto } from '@zpanel/core';

import { api } from 'src/service';
import configs from 'src/configs';
import { auth, PermissionGuard } from 'src/guards';
import { PageHead } from 'src/components';
import NotificationHistoryView from 'src/views/administration/NotificationHistoryView';

// ----------

interface PageProps {
  searchParams: Promise<{ page: number; limit: number }>;
}

async function Page({ searchParams }: PageProps) {
  const query = FindAllNotificationsDto.schema.parse(await searchParams);
  const { items: notifications, count } = await auth(api.getNotifications(query));

  return (
    <Container maxWidth="xl" sx={{ paddingX: { xs: 2, md: 4 }, transition: 'padding ease 0.3s' }}>
      <PageHead
        title={metadata.title}
        breadcrumbs={[
          { label: 'Dashboard', href: configs.routes.dashboard },
          { label: 'Configuration' },
          { label: 'Notification' },
        ]}
        marginBottom={{ xs: 3, md: -3.5 }}
      />

      <NotificationHistoryView
        notifications={notifications}
        paginationProps={{
          count: Math.ceil(count / query.limit) || 1,
          page: query.page,
        }}
      />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.PERMISSION_CONFIGURE);

export const metadata = {
  title: 'Notification History',
};

export const dynamic = 'force-dynamic';
