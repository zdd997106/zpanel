import { FindUsersDto } from '@zpanel/core';
import { EPermission } from '@zpanel/core/enum';
import { Container } from '@mui/material';

import { api } from 'src/service';
import configs from 'src/configs';
import { PermissionGuard } from 'src/guards';
import { PageHead } from 'src/components';
import UserView from 'src/views/administration/UserView';

// ----------

interface PageProps {
  searchParams: Promise<{ page: number; limit: number }>;
}

async function Page({ searchParams }: PageProps) {
  const query = FindUsersDto.schema.parse(await searchParams);
  const { items: users, count } = await api.getUsers(query);

  return (
    <Container maxWidth="md">
      <PageHead
        title={metadata.title}
        breadcrumbs={[{ label: 'Dashboard', href: configs.routes.dashboard }, { label: 'User' }]}
        marginBottom={{ xs: -3.5 }}
      />

      <UserView
        users={users}
        paginationProps={{
          count: Math.ceil(count / query.limit),
          page: query.page,
        }}
      />
    </Container>
  );
}

export default PermissionGuard.protect(Page, EPermission.USER_CONFIGURE);

export const metadata = {
  title: 'User Management',
};

export const dynamic = 'force-dynamic';
